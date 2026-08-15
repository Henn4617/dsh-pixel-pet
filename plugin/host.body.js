return {
  apply(ctx) {
    // Tracks every live agent in the process. A "task" is an agent whose
    // driver is running; a completion is an agent leaving running -> idle.
    const runningSince = new Map() // Agent -> timestamp when it started running
    let runningCount = 0
    let completionCount = 0
    let lastCompletionAt = 0

    function markRunning(agent) {
      if (!agent || runningSince.has(agent)) return
      runningSince.set(agent, Date.now())
      runningCount += 1
    }

    function markIdle(agent) {
      if (!agent) return
      const started = runningSince.get(agent)
      if (started === undefined) return
      runningSince.delete(agent)
      runningCount = Math.max(0, runningCount - 1)
      // Ignore sub-second blips (idle flapping between steps of one turn).
      if (Date.now() - started >= 800) {
        completionCount += 1
        lastCompletionAt = Date.now()
      }
    }

    ctx.on('agent/status', function (payload) {
      const p = payload || {}
      if (p.status === 'running') markRunning(p.agent)
      else markIdle(p.agent)
    })

    ctx.on('agent/disposed', function (payload) {
      markIdle((payload || {}).agent)
    })

    harness.handle('pet-state', function () {
      return {
        status: runningCount > 0 ? 'running' : 'idle',
        runningCount: runningCount,
        completionCount: completionCount,
        lastCompletionAt: lastCompletionAt,
      }
    })
  },
}
