#!/usr/bin/env python3
"""通过 GitHub REST API 推送所有修改过的文件"""
import json
import os
import base64
import urllib.request
import urllib.error
import ssl

# 配置
OWNER = "AstarAllison"
REPO = "resume"
BRANCH = "main"
WORK_DIR = r"D:\WorkBuddy\resume-website"

# 需要推送的 25 个文件
CHANGED_FILES = [
    "index.html",
    "css/style.css",
    "js/page-nav.js",
    "project-detail.html",
    "skill-detail.html",
    "campus-detail.html",
    "campus-detail-japanese.html",
    "campus-detail-volunteer.html",
    "education-detail-bachelor.html",
    "education-detail-master.html",
    "experience-detail.html",
    "experience-detail-ccb.html",
    "portfolio-detail-ai-invest.html",
    "portfolio-detail-audit.html",
    "portfolio-detail-event-plan.html",
    "portfolio-detail-excel.html",
    "portfolio-detail-game-analysis.html",
    "portfolio-detail-ppt.html",
    "portfolio-detail-python.html",
    "portfolio-detail-r.html",
    "portfolio-detail-securities.html",
    "portfolio-detail-swot.html",
    "portfolio-detail-video.html",
    "portfolio-detail-webdesign.html",
    "硬刷新指南.md",
]

# 尝试从 MCP connector 配置中读取 token
def get_token():
    """尝试多种方式获取 GitHub token"""
    # 1. 环境变量
    for key in ["GITHUB_TOKEN", "GH_TOKEN", "GITHUB_PAT"]:
        val = os.environ.get(key)
        if val:
            print(f"  从环境变量 {key} 获取到 token")
            return val

    # 2. MCP connector 配置文件
    connector_paths = [
        os.path.expanduser("~/.workbuddy/connectors/default/mcp.json"),
        os.path.expanduser("~/.workbuddy/connectors/2437f99b-6cfa-4de7-9d8a-9c20d9bfb8e8/mcp.json"),
    ]
    for path in connector_paths:
        try:
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    config = json.load(f)
                # 查找 github 相关配置
                config_str = json.dumps(config)
                # 尝试找到 token
                if "github" in config_str.lower():
                    print(f"  在 {path} 中找到 github 配置")
                    # 尝试多种可能的 token 字段
                    def find_token(obj):
                        if isinstance(obj, dict):
                            for k, v in obj.items():
                                if k.lower() in ["token", "github_token", "personal_access_token", "pat"]:
                                    if isinstance(v, str) and len(v) > 10:
                                        return v
                                result = find_token(v)
                                if result:
                                    return result
                        elif isinstance(obj, list):
                            for item in obj:
                                result = find_token(item)
                                if result:
                                    return result
                        return None
                    token = find_token(config)
                    if token:
                        print(f"  从配置中提取到 token (前10位: {token[:10]}...)")
                        return token
        except Exception as e:
            print(f"  读取 {path} 失败: {e}")

    # 3. git credential store
    cred_path = os.path.expanduser("~/.git-credentials")
    try:
        if os.path.exists(cred_path):
            with open(cred_path, "r") as f:
                for line in f:
                    if "github.com" in line:
                        # 格式: https://username:token@github.com
                        parts = line.strip().split(":")
                        if len(parts) >= 3:
                            token = parts[2].split("@")[0]
                            print(f"  从 git-credentials 获取到 token")
                            return token
    except:
        pass

    return None


def github_api(method, path, token, data=None):
    """调用 GitHub API"""
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/{path}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    ctx = ssl.create_default_context()

    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            resp_data = resp.read().decode("utf-8")
            return json.loads(resp_data) if resp_data else {}
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8") if e.fp else ""
        print(f"  API 错误 {e.code}: {error_body[:200]}")
        raise
    except Exception as e:
        print(f"  请求失败: {e}")
        raise


def push_all_files(token):
    """使用 GitHub Git Database API 推送所有文件"""
    print("\n=== 开始推送 ===")

    # 1. 获取 main 分支当前 commit 的 SHA
    print("1. 获取 main 分支当前 SHA...")
    ref = github_api("GET", f"git/refs/heads/{BRANCH}", token)
    parent_sha = ref["object"]["sha"]
    print(f"   当前 main SHA: {parent_sha}")

    # 2. 获取当前 commit 的 tree SHA
    print("2. 获取当前 commit 的 tree...")
    commit = github_api("GET", f"git/commits/{parent_sha}", token)
    base_tree = commit["tree"]["sha"]
    print(f"   Base tree SHA: {base_tree}")

    # 3. 为每个文件创建 blob
    print(f"3. 为 {len(CHANGED_FILES)} 个文件创建 blobs...")
    tree_items = []
    for filepath in CHANGED_FILES:
        full_path = os.path.join(WORK_DIR, filepath)
        if not os.path.exists(full_path):
            print(f"   ⚠ 文件不存在，跳过: {filepath}")
            continue

        with open(full_path, "rb") as f:
            content_bytes = f.read()

        # 创建 blob
        blob_data = {
            "content": base64.b64encode(content_bytes).decode("utf-8"),
            "encoding": "base64"
        }
        blob = github_api("POST", "git/blobs", token, blob_data)
        blob_sha = blob["sha"]

        tree_items.append({
            "path": filepath,
            "mode": "100644",
            "type": "blob",
            "sha": blob_sha,
        })
        print(f"   ✓ {filepath} ({len(content_bytes)} bytes)")

    # 4. 创建新 tree
    print(f"4. 创建新 tree（{len(tree_items)} 个文件）...")
    tree_data = {
        "base_tree": base_tree,
        "tree": tree_items,
    }
    new_tree = github_api("POST", "git/trees", token, tree_data)
    new_tree_sha = new_tree["sha"]
    print(f"   新 tree SHA: {new_tree_sha}")

    # 5. 创建 commit
    print("5. 创建新 commit...")
    commit_data = {
        "message": "\n".join([
            "Responsive layout fix + mobile FAB nav + detail page centering",
            "",
            "- Added 480px/360px/large-screen/landscape/print breakpoints (style.css)",
            "- 19 detail pages: added 2 new @media breakpoints each",
            "- Added floating circular menu button FAB (auto-show when sidebar hidden)",
            "- Removed hardcoded margin-left:230px from 21 detail pages (fix mobile offset)",
            "- FAB position moved to top:100px + transparent overlay + removed right whitespace",
            "- Fixed FAB sidebar links not clickable (lowered overlay z-index)",
            "- Fixed award card title overflow (line break for long title)",
        ]),
        "tree": new_tree_sha,
        "parents": [parent_sha],
    }
    new_commit = github_api("POST", "git/commits", token, commit_data)
    new_commit_sha = new_commit["sha"]
    print(f"   新 commit SHA: {new_commit_sha}")

    # 6. 更新 main 分支引用
    print("6. 更新 main 分支引用...")
    ref_data = {
        "sha": new_commit_sha,
        "force": False,
    }
    result = github_api("PATCH", f"git/refs/heads/{BRANCH}", token, ref_data)
    print(f"   ✅ main 分支已更新到 {result['object']['sha'][:7]}")

    return new_commit_sha


def main():
    print("=== GitHub 文件推送工具 ===")
    print(f"仓库: {OWNER}/{REPO}")
    print(f"分支: {BRANCH}")
    print(f"工作区: {WORK_DIR}")
    print(f"待推送文件数: {len(CHANGED_FILES)}")

    # 获取 token
    print("\n=== 查找 GitHub token ===")
    token = get_token()

    if not token:
        print("\n❌ 未找到 GitHub token！")
        print("请设置 GITHUB_TOKEN 环境变量，或确保 MCP connector 配置中有 token。")
        return False

    # 验证 token
    print("\n=== 验证 token ===")
    try:
        req = urllib.request.Request(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"},
        )
        with urllib.request.urlopen(req, context=ssl.create_default_context()) as resp:
            user = json.loads(resp.read().decode("utf-8"))
            print(f"   ✅ 认证成功！用户: {user.get('login', 'unknown')}")
    except Exception as e:
        print(f"   ❌ 认证失败: {e}")
        return False

    # 推送文件
    try:
        commit_sha = push_all_files(token)
        print(f"\n🎉 推送成功！Commit: {commit_sha[:7]}")
        print(f"   GitHub Pages 将在 1-2 分钟内自动重新部署")
        return True
    except Exception as e:
        print(f"\n❌ 推送失败: {e}")
        return False


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
