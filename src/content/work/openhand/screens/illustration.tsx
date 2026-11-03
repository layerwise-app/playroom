import type { CSSProperties, ReactNode } from 'react';
import { C } from './kit';

/*
 * Openhand's library illustrations: drawn from simple shapes so a page never
 * launches with a gray box. The agent places one until the org adds a photo.
 * Three scenes for "Try another": the roofline, the tool wall, the repair.
 */

const stroke = { stroke: C.ink, strokeWidth: 1.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Piece({ animate, delay, children }: { animate: boolean; delay: number; children: ReactNode }) {
  if (!animate) return <g>{children}</g>;
  return (
    <g className='oh-pop' style={{ animationDelay: `${delay}ms` }}>
      {children}
    </g>
  );
}

const drop = (x: number, y: number, size = 1) =>
  `M${x} ${y - 5 * size}C${x + 2 * size} ${y - 2 * size} ${x + 3 * size} ${y} ${x + 3 * size} ${y + 1.5 * size}A${3 * size} ${3 * size} 0 0 1 ${x - 3 * size} ${y + 1.5 * size}C${x - 3 * size} ${y} ${x - 2 * size} ${y - 2 * size} ${x} ${y - 5 * size}Z`;

function Roofline({ animate }: { animate: boolean }) {
  return (
    <>
      <rect width='300' height='110' fill={C.peach} />
      <Piece animate={animate} delay={0}>
        <rect x='0' y='94' width='300' height='16' fill={C.rule} />
        <path d='M14 94H286' {...stroke} />
      </Piece>
      <Piece animate={animate} delay={80}>
        <rect x='118' y='54' width='84' height='40' fill={C.cream} {...stroke} />
        <rect x='128' y='64' width='18' height='14' rx='1' fill={C.peach} {...stroke} strokeWidth={1.3} />
        <path d='M137 67.5V76.5' {...stroke} strokeWidth={1.7} />
        <path d='M133.4 67.6H140.6' {...stroke} strokeWidth={2.8} />
        <rect x='174' y='64' width='18' height='14' rx='1' fill={C.peach} {...stroke} strokeWidth={1.3} />
        <path d='M178.5 75.5 186 68' {...stroke} strokeWidth={1.7} />
        <circle cx='187' cy='67' r='2.3' fill={C.peach} {...stroke} strokeWidth={1.4} />
        <path d='M152 94V71.5a1.5 1.5 0 0 1 1.5-1.5h13a1.5 1.5 0 0 1 1.5 1.5V94Z' fill={C.ink} />
        <circle cx='164.4' cy='83' r='1.1' fill={C.cream} />
        <rect x='146' y='57.5' width='28' height='9' rx='1.5' fill={C.white} {...stroke} strokeWidth={1.2} />
        <text
          x='160'
          y='64.1'
          textAnchor='middle'
          fontSize='5.4'
          fontWeight='800'
          letterSpacing='0.7'
          fill={C.ink}
        >
          TOOLS
        </text>
      </Piece>
      <Piece animate={animate} delay={180}>
        <path d='M108 56.5 160 25.5 212 56.5Z' fill={C.ember} {...stroke} strokeWidth={1.6} />
        <path d='M128 46.2H170M181 46.2H192' stroke={C.vermilion} strokeWidth='1.5' strokeLinecap='round' strokeDasharray='6 4' />
        <path d='M143 36.2H177' stroke={C.vermilion} strokeWidth='1.5' strokeLinecap='round' strokeDasharray='6 4' />
        <path d='M172.5 40.4 179 37.6 184.6 40.2 186.8 45.2 180 47.6 175.6 45.4Z' fill={C.peach} {...stroke} strokeWidth={1.3} />
      </Piece>
      <Piece animate={animate} delay={260}>
        <path d='M240 94V70' {...stroke} strokeWidth={2.4} />
        <circle cx='240' cy='62' r='13' fill={C.vermilion} {...stroke} />
        <circle cx='229' cy='71' r='8' fill={C.vermilion} {...stroke} />
      </Piece>
      <Piece animate={animate} delay={340}>
        <rect x='56' y='22' width='48' height='12' rx='6' fill={C.white} />
        <circle cx='69' cy='22' r='8' fill={C.white} />
        <circle cx='84' cy='18' r='11' fill={C.white} />
        <circle cx='97' cy='25' r='7' fill={C.white} />
      </Piece>
      <Piece animate={animate} delay={440}>
        {[
          [66, 40],
          [80, 44],
          [94, 40],
          [108, 46],
          [74, 54]
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y}l-3 7`} stroke={C.vermilion} strokeWidth='2' strokeLinecap='round' />
        ))}
        <path d={drop(180, 52, 0.8)} fill={C.vermilion} />
      </Piece>
    </>
  );
}

function ToolWall({ animate }: { animate: boolean }) {
  const pegs: ReactNode[] = [];
  for (let x = 60; x <= 240; x += 10) {
    for (let y = 20; y <= 88; y += 10) {
      pegs.push(<circle key={`${x}-${y}`} cx={x} cy={y} r='1.1' fill={C.rule} />);
    }
  }
  return (
    <>
      <rect width='300' height='110' fill={C.peach} />
      <Piece animate={animate} delay={0}>
        <rect x='0' y='98' width='300' height='12' fill={C.rule} />
        <rect x='50' y='12' width='200' height='82' rx='4' fill={C.cream} {...stroke} />
        {pegs}
      </Piece>
      <Piece animate={animate} delay={90}>
        <circle cx='72' cy='22' r='1.6' fill={C.ink} />
        <rect x='70' y='30' width='4.5' height='40' rx='2' fill={C.ember} {...stroke} strokeWidth={1.3} />
        <rect x='62' y='24' width='20.5' height='8' rx='1.5' fill={C.ink} />
      </Piece>
      <Piece animate={animate} delay={160}>
        <circle cx='96' cy='22' r='1.6' fill={C.ink} />
        <path d='M102 28.5 148 32V40L102 43.5Z' fill={C.white} {...stroke} strokeWidth={1.3} />
        <path d='M105 43.4l2.4 2.2 2.4-2.4 2.4 2.2 2.4-2.4 2.4 2.1 2.4-2.3 2.4 2 2.4-2.2 2.4 1.9 2.4-2.1 2.4 1.8 2.4-2 2.4 1.7 2.4-1.9 2.4 1.6 2.4-1.8' fill='none' stroke={C.ink} strokeWidth='1' strokeLinejoin='round' />
        <rect x='88' y='26' width='15' height='17' rx='4.5' fill={C.vermilion} {...stroke} strokeWidth={1.3} />
        <rect x='92' y='31' width='6.5' height='6.5' rx='2' fill={C.cream} {...stroke} strokeWidth={1.1} />
      </Piece>
      <Piece animate={animate} delay={230}>
        <path d='M170 35V74' {...stroke} strokeWidth={4.2} />
        <circle cx='170' cy='29' r='6.4' fill='none' {...stroke} strokeWidth={4} />
        <rect x='167.4' y='20' width='5.2' height='7' fill={C.cream} />
      </Piece>
      <Piece animate={animate} delay={290}>
        <circle cx='194' cy='22' r='1.6' fill={C.ink} />
        <rect x='190' y='26' width='8' height='18' rx='3' fill={C.ember} {...stroke} strokeWidth={1.3} />
        <path d='M194 44.5V70' {...stroke} strokeWidth={2.2} />
      </Piece>
      <Piece animate={animate} delay={350}>
        <circle cx='226' cy='40' r='11' fill={C.vermilion} {...stroke} />
        <circle cx='226' cy='40' r='4' fill={C.cream} {...stroke} strokeWidth={1.2} />
        <path d='M226 51H238.5V54.5H226' fill={C.cream} {...stroke} strokeWidth={1.1} />
      </Piece>
      <Piece animate={animate} delay={410}>
        <rect x='112' y='62' width='31' height='12.5' rx='4' fill={C.ember} {...stroke} strokeWidth={1.3} />
        <path d='M143.5 68.2H154' {...stroke} strokeWidth={2.2} />
        <rect x='117' y='74' width='9.5' height='14' rx='2' fill={C.ink} />
      </Piece>
      <Piece animate={animate} delay={480}>
        <path d='M256 84H273L270.6 101H258.4Z' fill={C.ink} />
        <path d='M256 84h17' {...stroke} strokeWidth={1.8} />
        <path d={drop(264.5, 52, 0.85)} fill={C.vermilion} />
        <path d={drop(264.5, 70, 0.85)} fill={C.vermilion} />
        <path d={drop(150, 6, 0.75)} fill={C.vermilion} />
      </Piece>
    </>
  );
}

function Repair({ animate }: { animate: boolean }) {
  const slope = 110 / 86;
  const row = (y: number) => [100 + (110 - y) * slope, 320 - (110 - y) * slope] as const;
  const rungs: ReactNode[] = [];
  for (let i = 1; i <= 6; i++) {
    const t = i / 7.2;
    const y = 104 - 66 * t;
    rungs.push(<path key={i} d={`M${120 + 46 * t} ${y}H${134 + 46 * t}`} {...stroke} strokeWidth={1.8} />);
  }
  return (
    <>
      <rect width='300' height='110' fill={C.peach} />
      <Piece animate={animate} delay={0}>
        <circle cx='62' cy='32' r='15' fill={C.vermilion} />
        <rect x='0' y='104' width='300' height='6' fill={C.rule} />
        <path d='M0 104H300' {...stroke} />
      </Piece>
      <Piece animate={animate} delay={110}>
        <path d='M100 110 210 24 320 110Z' fill={C.ember} {...stroke} strokeWidth={1.6} />
        {[50, 70, 90].map((y) => {
          const [a, b] = row(y);
          return <path key={y} d={`M${a + 3} ${y}H${b - 3}`} stroke={C.vermilion} strokeWidth='1.6' strokeLinecap='round' strokeDasharray='9 3.5' />;
        })}
      </Piece>
      <Piece animate={animate} delay={220}>
        <rect x='199' y='54' width='15' height='9' rx='1.2' fill={C.cream} {...stroke} strokeWidth={1.2} />
        <rect x='215.5' y='54' width='15' height='9' rx='1.2' fill={C.cream} {...stroke} strokeWidth={1.2} />
        <rect x='207' y='64.5' width='15' height='9' rx='1.2' fill={C.cream} {...stroke} strokeWidth={1.2} />
      </Piece>
      <Piece animate={animate} delay={320}>
        <path d='M120 104 166 38M134 104 180 38' {...stroke} strokeWidth={2.4} />
        {rungs}
      </Piece>
      <Piece animate={animate} delay={420}>
        <rect x='38' y='90' width='34' height='14' rx='2' fill={C.ember} {...stroke} strokeWidth={1.3} />
        <path d='M48 90v-4.5h14V90' fill='none' {...stroke} strokeWidth={1.6} />
        <path d='M38 96.5H72' {...stroke} strokeWidth={1.1} />
      </Piece>
    </>
  );
}

export function RoofScene({
  variant = 0,
  animate = false,
  style
}: {
  variant?: number;
  animate?: boolean;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox='0 0 300 110'
      preserveAspectRatio='xMidYMid slice'
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
      aria-hidden
    >
      {variant === 1 ? (
        <ToolWall animate={animate} />
      ) : variant === 2 ? (
        <Repair animate={animate} />
      ) : (
        <Roofline animate={animate} />
      )}
    </svg>
  );
}

export const SCENE_NAMES = ['the roofline', 'the tool wall', 'the repair'];
