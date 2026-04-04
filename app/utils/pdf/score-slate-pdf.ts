import { jsPDF } from 'jspdf'
import type { GameType } from '~/utils/game/game-types'
import { whistRowStartsSection } from '~/utils/game/whist'

export interface ScoreSlatePdfGridRow {
  label: string
  cells: string[]
}

export interface BuildScoreSlatePdfOptions {
  title: string
  subtitle?: string
  /** First header cell above the round / row label column (e.g. "Round"). */
  headerCornerLabel?: string
  /** Used for Whist section rules and consistent header/body weight. */
  gameType?: GameType
  playerNames: string[]
  rows: ScoreSlatePdfGridRow[]
  totalsRow?: string[]
}

/**
 * Single shared PDF shell: header + grid + optional totals. B&W-safe borders.
 */
export function buildScoreSlatePdf(opts: BuildScoreSlatePdfOptions): Blob {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 12
  let y = margin

  const headline =
    opts.subtitle != null && opts.subtitle.trim().length > 0
      ? `${opts.title} · ${opts.subtitle}`
      : opts.title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(15, 41, 66)
  const headlineMaxW = pageW - margin * 2
  const headlineLines = doc.splitTextToSize(headline, headlineMaxW)
  doc.text(headlineLines, margin, y)
  const headlineLineH = 6.5
  y += headlineLines.length * headlineLineH + 3

  const tableW = pageW - margin * 2
  /** Narrow first column (round / deal labels); remaining width split across players. */
  const labelColW = Math.min(24, Math.max(16, tableW * 0.14))
  const playerCount = opts.playerNames.length
  const playerColW =
    playerCount > 0 ? (tableW - labelColW) / playerCount : tableW - labelColW
  const rowH = 6

  const gridLineGray = 40
  doc.setDrawColor(gridLineGray, gridLineGray, gridLineGray)
  doc.setLineWidth(0.3)

  function colWidthAt(index: number): number {
    return index === 0 ? labelColW : playerColW
  }

  /**
   * Stronger horizontal rule (header/body, Whist sections, totals).
   * Drawn **after** cell rects so it is not covered by their top strokes (jsPDF order matters).
   */
  function drawThickTopRule(rowTop: number) {
    doc.setLineWidth(0.85)
    doc.setDrawColor(gridLineGray, gridLineGray, gridLineGray)
    doc.line(margin, rowTop, margin + tableW, rowTop)
    doc.setLineWidth(0.3)
    doc.setDrawColor(gridLineGray, gridLineGray, gridLineGray)
  }

  let tableGridTopMm: number | null = null
  let tableGridBottomMm = 0

  /** Outer frame + vertical rule after the label column; drawn last so it sits on top. */
  function drawOuterFrameAndLabelColumnDivider(top: number, bottom: number) {
    const left = margin
    const right = margin + tableW
    const xAfterLabel = margin + labelColW
    doc.setLineWidth(0.85)
    doc.setDrawColor(gridLineGray, gridLineGray, gridLineGray)
    doc.line(left, top, right, top)
    doc.line(left, bottom, right, bottom)
    doc.line(left, top, left, bottom)
    doc.line(right, top, right, bottom)
    doc.line(xAfterLabel, top, xAfterLabel, bottom)
    doc.setLineWidth(0.3)
    doc.setDrawColor(gridLineGray, gridLineGray, gridLineGray)
  }

  function drawRow(
    cells: string[],
    bold: boolean,
    options?: { thickTopLine?: boolean },
  ) {
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setFontSize(9)
    doc.setTextColor(20, 20, 20)
    const rowTop = y - 4
    if (tableGridTopMm === null) {
      tableGridTopMm = rowTop
    }
    const cellMidY = rowTop + rowH / 2
    let x = margin
    for (let c = 0; c < cells.length; c += 1) {
      const cw = colWidthAt(c)
      doc.rect(x, rowTop, cw, rowH)
      const text = cells[c] ?? ''
      const cx = x + cw / 2
      doc.text(String(text), cx, cellMidY, {
        align: 'center',
        baseline: 'middle',
        maxWidth: Math.max(0, cw - 2),
      })
      x += cw
    }
    if (options?.thickTopLine) {
      drawThickTopRule(rowTop)
    }
    tableGridBottomMm = rowTop + rowH
    y += rowH
  }

  const headerCells = [opts.headerCornerLabel ?? '', ...opts.playerNames]
  drawRow(headerCells, true)

  const gt = opts.gameType
  for (let ri = 0; ri < opts.rows.length; ri += 1) {
    const row = opts.rows[ri]
    const thickTopLine =
      ri === 0 ||
      (gt === 'whist' && whistRowStartsSection(ri, playerCount))
    drawRow([row.label, ...row.cells], false, { thickTopLine })
  }

  if (opts.totalsRow && opts.totalsRow.length) {
    drawRow(['Total', ...opts.totalsRow], true, { thickTopLine: true })
  }

  if (tableGridTopMm !== null) {
    drawOuterFrameAndLabelColumnDivider(tableGridTopMm, tableGridBottomMm)
  }

  return doc.output('blob')
}
