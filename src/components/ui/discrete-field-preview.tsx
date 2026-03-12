import { computeGrid, getFieldConfig } from "@/lib/discrete-field";

interface DiscreteFieldPreviewProps {
  slug: string;
  /** Pixel width of the computed grid (grid is clipped to container via overflow:hidden) */
  width?: number;
  /** Height in pixels */
  height?: number;
}

/**
 * Server component — renders a compact Discrete Field pixel-tile grid
 * for a given article slug. No client JS required.
 */
export function DiscreteFieldPreview({
  slug,
  width = 1100,
  height = 130,
}: DiscreteFieldPreviewProps) {
  const cfg = getFieldConfig(slug);
  if (!cfg) return null;

  // Use a proportionally smaller cell/gap for thumbnail-scale rendering
  const thumbCellSize = Math.max(7, Math.floor(cfg.cellSize * 0.52));
  const thumbGap = Math.max(1, Math.floor(cfg.gap * 0.6));

  const { cells, cols, cellSize, gap, bgColor } = computeGrid(
    cfg,
    width,
    height,
    {
      cellSize: thumbCellSize,
      gap: thumbGap,
      shadeCount: 6,
    },
  );

  return (
    <div
      style={{
        width: "100%",
        height,
        backgroundColor: bgColor,
        overflow: "hidden",
      }}
      aria-hidden="true"
     
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridAutoRows: `${cellSize}px`,
          gap: `${gap}px`,
        }}
       
      >
        {cells.map(({ color }, i) => (
          <div key={i} style={{ backgroundColor: color }} />
        ))}
      </div>
    </div>
  );
}
