// apps/web/src/App.tsx
// 应用入口 - 路由配置

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MarketPage } from './pages/Market'
import { SkillDetailPage } from './pages/SkillDetail'

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<MarketPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/skill/:id" element={<SkillDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
