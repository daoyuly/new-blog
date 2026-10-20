#!/usr/bin/env python3
"""从 lexfridman-cn 的 episodes.json 生成博客页面 source/lexfridman/index.md（链接列表）。

用法:
    python3 tools/gen_lex_page.py

数据源: lexfridman-cn/site/data/episodes.json（由 lexfridman-cn 仓库构建管线产出）
页面规则:
    - 有中文精读 (r==1) → 链接到 https://lex.qiaomu.ai/zh/<slug>.html
    - 无中文精读       → 链接到 https://lex.qiaomu.ai/ep/<slug>/（官方音频原声页）
按年份倒序分组，同年内按期号/日期倒序。
"""

import json
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "lexfridman-cn" / "site" / "data" / "episodes.json"
OUT = ROOT / "source" / "lexfridman" / "index.md"
BASE = "https://lex.qiaomu.ai"

TZ = timezone(timedelta(hours=8))


def main():
    eps = json.loads(SRC.read_text(encoding="utf-8"))["episodes"]
    total = len(eps)
    read_cnt = sum(1 for e in eps if e.get("r"))

    # 按年份分组（倒序），组内倒序
    groups = {}
    for e in eps:
        year = (e.get("d") or "0000")[:4]
        groups.setdefault(year, []).append(e)
    for year in groups:
        groups[year].sort(
            key=lambda e: (e.get("d") or "", e.get("n") or 0), reverse=True
        )
    years = sorted(groups, reverse=True)

    now = datetime.now(TZ).strftime("%Y-%m-%d %H:%M:%S")
    lines = [
        "---",
        "title: Lex Fridman 播客中文站",
        "layout: page",
        f"date: {now}",
        "comments: false",
        "noDate: true",
        "---",
        "",
        "<p class=\"biz-lead\">把 <a href=\"https://lexfridman.com/\" target=\"_blank\" rel=\"noopener\">Lex Fridman Podcast</a> "
        f"全部 <strong>{total}</strong> 期整理成中文索引：官方音频直链、中英双语标题，其中 <strong>{read_cnt}</strong> 篇已有 AI 中文精读长文。点击任意条目跳转 <a href=\"https://lex.qiaomu.ai/\" target=\"_blank\" rel=\"noopener\">lex.qiaomu.ai</a> 阅读/收听。</p>",
        "",
        f"> 共 {total} 期 ｜ 中文精读 {read_cnt} 篇 ｜ 数据更新于 {now[:10]}",
        "> 未标注（原声）的条目均为中文精读页；标（原声）的条目暂无精读，跳转官方音频页。",
        "",
        "## 全部单集",
        "",
    ]

    for year in years:
        lines.append(f"### {year}")
        lines.append("")
        for e in groups[year]:
            slug = e["s"]
            zh_title = (e.get("zh") or e.get("t") or slug).strip()
            date = (e.get("d") or "")[:10]
            if e.get("r"):
                url = f"{BASE}/zh/{slug}.html"
                tag = ""
            else:
                url = f"{BASE}/ep/{slug}/"
                tag = "（原声）"
            guest = (e.get("guest") or "").strip()
            label = f"{zh_title}{tag}"
            meta = f" {guest} · {date}" if guest else f" {date}"
            lines.append(f"- [{label}]({url}) ·{meta}")
        lines.append("")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"OK -> {OUT}  ({total} eps, {read_cnt} reads, {len(years)} year groups)")


if __name__ == "__main__":
    main()
