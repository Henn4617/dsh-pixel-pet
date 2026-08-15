# DSH 像素小狗桌宠（Pixel Puppy Desk Pet）

> 一个观测 **DSH（DeepSeek Harness）agent 任务进度**的像素风桌宠插件。
> 空闲时蹲坐吐舌，任务进行中刨地，任务完成时犬吠一声并回归空闲。

![dsh-plugin](https://img.shields.io/badge/dsh-plugin-🐶-e0a95f)

## 效果

| 状态 | 小狗行为 | 触发条件 | 状态栏 |
|---|---|---|---|
| 🟢 空闲 | 蹲坐、吐舌哈气（两帧喘气动画） | 无 agent 运行 | `休息中…` |
| 🟡 任务中 | 前爪交替刨地 + 泥土飞溅 + 身体颠动 | 任一 agent `running` | `工作中…` |
| 🔴 完成 | 张嘴吠叫 + 「汪！」气泡 + 播放犬吠音效 | agent `running → idle` | `任务完成，汪！` |

## 特性

- **像素画小狗**：16×14 手工绘制，共 9 帧（空闲 ×2 / 刨地 ×4 / 吠叫 ×3）
- **真实犬吠音效**：由 `犬吠.mov` 裁剪转换（8kHz 8bit 单声道 WAV），base64 内嵌进 Client 代码，零文件/网络依赖；解码失败自动回退到合成音
- **可拖动**：按住小狗可移动到屏幕任意位置
- **点击会叫**：点击小狗播放一声犬吠（同时解锁浏览器音频权限）
- **多任务感知**：同时多个 agent 运行时显示 `工作中 ×N`

## 工作原理

插件由 Host + Client 两半组成：

- **Host 端**（运行在 DSH 的 Node.js 进程）
  - 监听 `agent/status` 与 `agent/disposed` 事件，追踪进程中**所有 agent** 的运行状态
  - agent 进入 `running` 视为任务开始；`running → idle`（持续 ≥ 800ms）视为任务完成
  - 通过私有 RPC `pet-state` 向 Client 暴露 `status` / `runningCount` / `completionCount`

- **Client 端**（运行在浏览器页面）
  - 注册在 `shell.overlay`（根作用域悬浮层），悬浮于整个界面之上
  - 每 800ms 轮询 `pet-state`，驱动三态切换与动画
  - WebAudio 播放内嵌犬吠，页面首次交互时解锁音频

## 目录结构

```
dsh-pixel-pet/
├── README.md
├── LICENSE
├── plugin/            # 插件本体（cordis_define 的 code.host / code.client）
│   ├── host.body.js
│   └── client.body.js
├── src/               # 开发资产（重建插件用）
│   ├── sprites.js        # 像素画数据（9 帧）
│   ├── render.js         # 纯 Node PNG 渲染校验脚本
│   └── build-plugin.js   # 从 sprites + 音频构建 host/client 代码
└── assets/
    └── bark.wav          # 犬吠音效（8kHz 8bit 单声道）
```

## 安装

这是一个 **Dynamic Cordis Plugin**（临时运行时扩展，进程重启后不保留定义）。
在 DSH Web GUI 中通过 `cordis_define` + `cordis_run` 安装：

1. 用 `cordis_define` 新建插件（`idPrefix` 取 3–6 位小写字母，如 `dogpt`），
   将 `plugin/host.body.js` 的内容作为 `code.host`、
   `plugin/client.body.js` 的内容作为 `code.client`
2. 用返回的 `pluginId` / `packageId` 调用 `cordis_run`（首次用 `mode: "run"`）
3. 在界面中批准运行，小狗出现在右下角

## 构建（修改后重新生成）

`src/build-plugin.js` 从 `src/sprites.js` 与 `assets/bark.wav` 生成
`plugin/host.body.js` 与 `plugin/client.body.js`：

```bash
cd src
node build-plugin.js
```

生成的两个文件即最新的 `code.host` / `code.client`。修改后以**新 Package** 追加到同一插件
（`cordis_define` 用 `kind: "existing"`），再 `cordis_run` 用 `mode: "update"` 升级。

## License

MIT
