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
  width = 600,
  height = 130,
}: DiscreteFieldPreviewProps) {
  const cfg = getFieldConfig(slug);
  if (!cfg) return null;

  // Use a proportionally smaller cell/gap for thumbnail-scale rendering
  const thumbCellSize = Math.max(7, Math.floor(cfg.cellSize * 0.52));
  const thumbGap = Math.max(1, Math.floor(cfg.gap * 0.6));

  const { cells, cellSize, gap, bgColor } = computeGrid(cfg, width, height, {
    cellSize: thumbCellSize,
    gap: thumbGap,
    shadeCount: 6,
  });

  return (
    <div
      style={{
        width: "100%",
        height,
        backgroundColor: bgColor,
        overflow: "hidden",
        display: "flex",
        flexWrap: "wrap",
        alignContent: "flex-start",
      }}
      aria-hidden="true"
    >
      {cells.map(({ color }, i) => (
        <div
          key={i}
          style={{
            width: cellSize,
            height: cellSize,
            backgroundColor: color,
            marginRight: gap,
            marginBottom: gap,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}
