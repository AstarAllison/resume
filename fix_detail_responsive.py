#!/usr/bin/env python3
"""批量给所有详情页添加小手机(480px/360px)响应式断点"""

import os
import re
import glob

os.chdir(r"D:\WorkBuddy\resume-website")

# 旧的单行 @media 768px 块
old_media = """@media (max-width: 768px) { .detail-container { padding: 24px 18px 48px; } .detail-title { font-size: 1.5rem; } .detail-block { padding: 16px 18px; } }"""

# 新的多断点响应式块
new_media = """@media (max-width: 768px) { .detail-container { padding: 24px 18px 48px; } .detail-title { font-size: 1.5rem; } .detail-block { padding: 16px 18px; } .detail-meta { gap: 12px; font-size: 0.85rem; } .detail-block h4 { font-size: 0.95rem; } .detail-block p { font-size: 0.88rem; } .detail-block li { font-size: 0.86rem; } }
        @media (max-width: 480px) { .detail-container { padding: 16px 12px 36px; } .detail-title { font-size: 1.25rem; } .detail-header { margin-bottom: 24px; padding-bottom: 16px; } .detail-block { padding: 14px 16px; margin-bottom: 14px; } .detail-block h4 { font-size: 0.9rem; } .detail-block p { font-size: 0.82rem; line-height: 1.7; } .detail-block li { font-size: 0.8rem; padding: 5px 0; } .detail-meta { gap: 8px; font-size: 0.78rem; } .tag-list span { font-size: 0.75rem; padding: 4px 10px; } }
        @media (max-width: 360px) { .detail-container { padding: 12px 8px 28px; } .detail-title { font-size: 1.1rem; } .detail-block { padding: 12px 14px; } }"""

# 找所有详情页
patterns = [
    "portfolio-detail-*.html",
    "education-detail-*.html",
    "campus-detail-*.html",
    "project-detail.html",
    "skill-detail.html",
]

files = []
for p in patterns:
    files.extend(glob.glob(p))

print(f"找到 {len(files)} 个详情页文件")

updated = 0
for f in files:
    with open(f, "r", encoding="utf-8") as fh:
        content = fh.read()

    if old_media in content:
        content = content.replace(old_media, new_media)
        with open(f, "w", encoding="utf-8") as fh:
            fh.write(content)
        updated += 1
        print(f"  ✅ {f}")
    else:
        print(f"  ⚠️  {f} — 未找到目标 @media 块，跳过")

print(f"\n完成：{updated}/{len(files)} 个文件已更新")
