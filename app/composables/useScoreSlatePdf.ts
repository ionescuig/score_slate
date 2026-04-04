import { buildScoreSlatePdfOptions } from '~/utils/pdf/score-sheet-export'

export function useScoreSlatePdf() {
  const game = useGameStore()

  async function buildPdfBlob(): Promise<Blob | null> {
    if (!game.gameType || !import.meta.client) {
      return null
    }
    const { buildScoreSlatePdf } = await import('~/utils/pdf/score-slate-pdf')
    return buildScoreSlatePdf(
      buildScoreSlatePdfOptions({
        gameType: game.gameType,
        playerIds: game.playerIds,
        playerNames: game.playerNames,
        rowLabels: game.rowLabels,
        scores: game.scores,
        runningTotals: game.runningTotals,
      }),
    )
  }

  async function downloadPdf() {
    const blob = await buildPdfBlob()
    if (!blob) {
      return
    }
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `score-slate-${game.gameType}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function printPdf() {
    const blob = await buildPdfBlob()
    if (!blob) {
      return
    }
    const url = URL.createObjectURL(blob)
    const iframe = document.createElement('iframe')
    iframe.setAttribute('aria-hidden', 'true')
    iframe.style.cssText =
      'position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none'
    iframe.src = url
    document.body.appendChild(iframe)

    let printed = false
    let cleaned = false

    function cleanup() {
      if (cleaned) {
        return
      }
      cleaned = true
      URL.revokeObjectURL(url)
      iframe.remove()
    }

    function runPrint() {
      if (printed) {
        return
      }
      const w = iframe.contentWindow
      if (!w) {
        cleanup()
        return
      }
      printed = true
      w.focus()
      w.print()
      setTimeout(cleanup, 750)
    }

    iframe.onload = () => {
      runPrint()
    }
    setTimeout(() => {
      if (!printed) {
        runPrint()
      }
    }, 1000)
  }

  return {
    downloadPdf,
    printPdf,
  }
}
