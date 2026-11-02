import React, { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { DashboardPage } from './pages/DashboardPage'
import { DigitalTwinPage } from './pages/DigitalTwinPage'
import { CapacityEnginePage } from './pages/CapacityEnginePage'
import { OptimizerPage } from './pages/OptimizerPage'
import { SimulatorPage } from './pages/SimulatorPage'
import { BudgetPage } from './pages/BudgetPage'
import { ConnectivityPage } from './pages/ConnectivityPage'
import { CriticalServicesPage } from './pages/CriticalServicesPage'

export function App() {
  const [currentModule, setCurrentModule] = useState<string>('dashboard')
  const [capacity, setCapacity] = useState<number>(100000)
  const [matchPhase, setMatchPhase] = useState<string>('Innings break')
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  // System Health baseline
  const healthScore = capacity === 65000 ? 35 : 28
  const healthStatus: 'OPTIMAL' | 'WARNING' | 'CRITICAL' = 'CRITICAL'

  const handleRefresh = () => {
    setIsRefreshing(true)
    setRefreshTrigger((prev) => prev + 1)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 600)
  }

  return (
    <div className="flex h-screen bg-[#0B0F19] text-white overflow-hidden font-sans">
      {/* Permanent Enterprise Sidebar */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={(mod) => setCurrentModule(mod)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          capacity={capacity}
          onCapacityChange={(c) => setCapacity(c)}
          matchPhase={matchPhase}
          onPhaseChange={(p) => setMatchPhase(p)}
          healthScore={healthScore}
          healthStatus={healthStatus}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto">
          {currentModule === 'dashboard' ? (
            <DashboardPage
              capacity={capacity}
              matchPhase={matchPhase}
              refreshTrigger={refreshTrigger}
            />
          ) : currentModule === 'digital-twin' ? (
            <DigitalTwinPage
              matchPhase={matchPhase}
              refreshTrigger={refreshTrigger}
            />
          ) : currentModule === 'demand-capacity' ? (
            <CapacityEnginePage
              initialCapacity={capacity}
            />
          ) : currentModule === 'optimizer' ? (
            <OptimizerPage
              initialCapacity={capacity}
            />
          ) : currentModule === 'simulator' ? (
            <SimulatorPage
              initialCapacity={capacity}
            />
          ) : currentModule === 'budget' ? (
            <BudgetPage
              initialCapacity={capacity}
            />
          ) : currentModule === 'connectivity' ? (
            <ConnectivityPage
              initialCapacity={capacity}
            />
          ) : currentModule === 'critical-services' ? (
            <CriticalServicesPage
              initialCapacity={capacity}
            />
          ) : (
            <div className="p-12 card-gradient rounded-2xl border border-[#223050] text-center space-y-4">
              <h2 className="text-xl font-bold text-white">Module Pending Development</h2>
              <p className="text-sm text-slate-400">
                This module will be implemented incrementally in subsequent milestone commits as per the Airtel SYNC roadmap.
              </p>
              <button
                onClick={() => setCurrentModule('dashboard')}
                className="px-4 py-2 bg-[#E40000] text-white rounded-xl text-xs font-semibold"
              >
                Return to Command Centre
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
