<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
# TelcoInsight AI

# Run and deploy your AI Studio app
TelcoInsight AI 是一个面向电信行业的 FWA（Fixed Wireless Access，固定无线接入）战略分析 Web 应用。用户输入国家/地区、目标运营商和输出语言后，系统会调用 Gemini 生成结构化战略报告，并在前端以报告、图表和对话助手的形式展示分析结果。

This contains everything you need to run your app locally.
## 核心能力

View your app in AI Studio: https://ai.studio/apps/drive/1oWZhOsp8GvjhJq_obLKVF9E-KzRi3Xt0
- **FWA 战略报告生成**：围绕运营商、目标市场、频谱资源、网络建设、商业策略和 ROI 生成完整分析。
- **双阶段 AI 分析流程**：先生成核心报告，再用审计视角补充专家批判、研究方向和风险提醒。
- **频谱可视化**：使用 Recharts 展示频段覆盖能力、容量能力、技术制式和部署状态。
- **交互式报告阅读**：报告按战略审计、市场动态、价值主张、频谱、技术栈、ROI 和来源分区展示。
- **上下文问答助手**：生成报告后，可以基于报告内容继续追问技术架构、商业逻辑和投资回报。
- **中英文输出**：支持 English 和中文两种报告语言。
- **Vercel 部署就绪**：仓库内置 Vite 构建配置和 Vercel 部署配置。

## Run Locally
## 技术栈

**Prerequisites:**  Node.js
- **前端框架**：React 19 + TypeScript
- **构建工具**：Vite 6
- **AI SDK**：`@google/genai`
- **图表**：Recharts
- **动效**：Framer Motion
- **图标**：Lucide React
- **部署平台**：Vercel 或其他静态站点托管平台

## 项目架构

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
```text
.
├── App.tsx                         # 应用主入口，管理报告生成、导航和聊天面板状态
├── index.tsx                       # React DOM 挂载入口
├── index.html                      # HTML 模板和导入映射
├── types.ts                        # 报告、频谱、技术能力、聊天消息等 TypeScript 类型
├── vite.config.ts                  # Vite 配置，注入 GEMINI_API_KEY 并设置路径别名
├── vercel.json                     # Vercel 构建输出和 SPA 路由配置
├── components/
│   ├── InputSection.tsx            # 国家/地区、运营商、语言输入表单
│   ├── ReportView.tsx              # 结构化报告展示页面
│   ├── SpectrumChart.tsx           # 频谱覆盖与容量图表
│   └── ChatInterface.tsx           # 基于报告上下文的追问聊天界面
└── services/
    └── geminiService.ts            # Gemini 报告生成、专家审计和聊天调用逻辑
```

## 数据流说明

1. 用户在首页输入：
   - Market Geography：目标国家/地区
   - Target Operator：目标运营商
   - Language：English 或 中文
2. `App.tsx` 调用 `generateFWAReport(country, operator, lang)`。
3. `services/geminiService.ts` 使用 Gemini 执行两阶段分析：
   - **Stage 1：Core Report Generation** 生成结构化 FWA 战略报告 JSON。
   - **Stage 2：Expert Critique** 对报告内容进行专家审计并补充批判意见。
4. 前端将合并后的 `FWAReport` 传入 `ReportView` 展示。
5. 用户可以打开 `ChatInterface`，基于当前报告继续追问。

## 报告结构

生成后的报告遵循 `FWAReport` 类型，主要包含：

- `executiveSummary`：高层摘要
- `fwaPotential`：FWA 潜力判断
- `currentAssessment`：当前能力评价
- `futurePriorities`：未来建设重点
- `painPoints`：市场痛点
- `strategicPositioning`：战略定位
- `valueProposition`：消费者、企业和运营商侧价值主张
- `spectrumAnalysis`：频谱概览、频段列表和工程分析
- `technicalCapabilities`：技术能力清单与优先级
- `networkPlanning`：网络规划和优化建议
- `commercialStrategy`：商业化和 GTM 策略
- `roiAnalysis`：ROI 假设、财务逻辑和投资回报判断
- `operations`：运营路线图
- `expertSummary`：专家审计总结
- `groundingChunks`：模型检索来源元数据

## 环境变量

本项目需要 Gemini API Key。

创建本地环境文件：

```bash
cp .env.example .env.local
```

然后填写：

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

> 注意：当前实现是纯前端 Vite 应用，`GEMINI_API_KEY` 会在构建时注入前端代码。生产环境如果需要保护密钥，建议将 Gemini 调用迁移到后端 API、Vercel Serverless Function 或其他服务端代理中。

## 本地开发

### 前置要求

- Node.js 20 或更新版本
- npm
- Gemini API Key

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

默认开发服务配置为：

```text
http://localhost:3000
```

### 生产构建

```bash
npm run build
```

### 本地预览生产包

```bash
npm run preview
```

## 部署到 Vercel

仓库已包含 `vercel.json`，Vercel 会执行：

- Build Command：`npm run build`
- Output Directory：`dist`
- Framework：`vite`

### 使用 Vercel Dashboard

1. 将仓库推送到 GitHub、GitLab 或 Bitbucket。
2. 在 Vercel 中选择 **Add New... > Project**。
3. 导入该仓库。
4. Framework Preset 选择或保持为 **Vite**。
5. 在 **Settings > Environment Variables** 中添加：
   - `GEMINI_API_KEY`
6. 点击 Deploy。

### 使用 Vercel CLI

```bash
npm install -g vercel
vercel login
vercel env add GEMINI_API_KEY production
vercel --prod
```

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | 构建生产版本到 `dist` |
| `npm run preview` | 本地预览生产构建结果 |

## 重要说明

- `.env` 和 `.env.local` 不应提交到 Git 仓库。
- 如果部署后报告生成失败，请优先检查 Vercel 环境变量中是否存在 `GEMINI_API_KEY`。
- 如果刷新子路径出现 404，请确认 Vercel 使用了仓库中的 `vercel.json`，其中包含 SPA rewrite 配置。
- AI 输出依赖模型能力和检索结果，正式商用前建议进行人工校验。
