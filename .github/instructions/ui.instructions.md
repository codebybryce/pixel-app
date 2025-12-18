# GitHub Copilot Project Instructions
# Pixel Art AI Editor — UI, UX, and Feature Guidelines

## CORE GOAL
Assist in building a modern, AI-powered pixel art editor with clean UI, fast rendering, cloud storage, and AI generation tools.

## UI REQUIREMENTS
- Increase contrast between canvas and background.
- Canvas should be clearly distinguished using a subtle border or glow.
- Add hover tooltips to all icons; keep labels short (e.g., “Brush”, “Eraser”).
- Add proper active/selected states for tools (highlighted, outlined, or colored).
- Group UI into:
  - Document Panel (title, pixel count, save options)
  - Canvas Panel
  - Toolbar (bottom)
  - AI Tools Panel (right side)

## TOOLING BEHAVIOR
- Each tool should include configurable options (brush size, color, shape).
- Add keyboard shortcuts:
  - B = brush
  - E = eraser
  - G = bucket fill
  - Cmd/Ctrl+Z = undo
  - Cmd/Ctrl+Shift+Z = redo
- Add a settings drawer for user preferences:
  - grid visibility
  - grid color
  - snap-to-grid toggle

## AI FEATURES
Implement the following AI-powered tools:
1. GeneratePixelArt(prompt: string)
2. EnhanceArt(inputCanvas)
3. SuggestAnimationFrames(frame1)
4. AutoPalette(theme: 'NES' | 'SNES' | 'GB' | 'Vaporwave' | 'Custom')
5. UpscalePixelArt(multiplier: number)

Copilot should help implement:
- UI for triggering these actions
- API handler architecture
- Frontend integration points

## CLOUD / FILE MANAGEMENT
- Provide Save to Cloud, Save As, Export PNG, Export SVG, Export Spritesheet.
- Add auto-save every 10 seconds or on change.
- Add project versioning (timestamped).

## CODE STYLE
- Use React with clean functional components.
- Prefer Zustand for state management.
- Use TailwindCSS for styling.
- Keep components small and modular.
- No inline styles; keep UI definitions consistent.
- All AI operations must be async with loading indicators.

## PERFORMANCE RULES
- Keep canvas rendering under 16ms per frame.
- Use offscreen canvas for heavy operations.
- Minimize re-renders by using memoization and shallow state.

## ACCESSIBILITY
- Ensure tool icons include aria-labels.
- Maintain color contrast ratio WCAG ≥ 4.5 where possible.
- Allow keyboard-only navigation.

## FUTURE FEATURES (Copilot may scaffold)
- Onion skin animation mode.
- Layer system similar to Photoshop.
- Collaboration mode with WebRTC or Liveblocks.
- Undo/Redo history panel.
