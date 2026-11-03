import type { ReactNode } from 'react';
import { BrowserWindow, Phone } from '~/components/frames';
import { u } from '~/components/stage';
import type { Still } from '~/content/stills';
import { Editor } from './screens/editor';
import { C, StillCursor } from './screens/kit';
import { draftWith, statusOf, type DraftState, type Status } from './screens/model';
import { BriefScreen, DonorDesktop, DonorMobile, EmptyGoalCard } from './screens/pages';
import { HistoryPanel, ReviewPanel } from './screens/panels';
import { fontFamily } from './theme';

/** Draw design-unit screens `z` times larger at a spot on the still. */
function Zoom({ x, y, z, w, h, children }: { x: number; y: number; z: number; w: number; h: number; children: ReactNode }) {
  return (
    <div
      className='absolute'
      style={{ left: u(x), top: u(y), width: u(w), height: u(h), transform: `scale(${z})`, transformOrigin: '0 0' }}
    >
      {children}
    </div>
  );
}

function Backdrop({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div className='absolute inset-0 overflow-hidden' style={{ background: color, fontFamily }}>
      {children}
    </div>
  );
}

function EditorWindow({
  width,
  height,
  state,
  status,
  panel,
  panelWidth,
  overlay,
  canvasTop
}: {
  canvasTop?: number;
  width: number;
  height: number;
  state: DraftState;
  status?: Status;
  panel?: ReactNode;
  panelWidth?: number;
  overlay?: ReactNode;
}) {
  return (
    <BrowserWindow url='openhand.org/pages/riverside-roof/edit' style={{ width: u(width), height: u(height + 30) }}>
      <Editor
        width={width}
        height={height}
        state={state}
        status={status ?? statusOf(state, false)}
        panel={panel}
        panelWidth={panelWidth}
        sheetOverlay={overlay}
        canvasTop={canvasTop}
      />
    </BrowserWindow>
  );
}

/** The block the agent is dragging, held under its cursor. Sheet design units. */
function Carry({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <>
      <div className='absolute' style={{ left: u(x - 22), top: u(y - 9), transform: 'rotate(-3deg)', zIndex: 29 }}>
        <span
          className='block'
          style={{
            padding: `${u(4)} ${u(10)}`,
            borderRadius: u(5),
            background: C.white,
            color: C.ember,
            fontSize: u(11.5),
            fontWeight: 650,
            lineHeight: 1.1,
            outline: `${u(1.5)} dashed ${C.vermilion}`,
            boxShadow: `0 ${u(6)} ${u(14)} ${u(-6)} rgba(43,26,20,.35)`
          }}
        >
          {label}
        </span>
      </div>
      <StillCursor x={x} y={y} label='Openhand agent' />
    </>
  );
}

const midDraft = draftWith(
  { hero: 'pending', goal: 'pending', story: 'pending' },
  { hero: 2 },
  { carrying: 'photo' }
);

function Cover() {
  return (
    <Backdrop color={C.vermilion}>
      <Zoom x={136} y={62} z={1.68} w={480} h={376}>
        <EditorWindow
          width={480}
          height={346}
          state={midDraft}
          status={{ kind: 'drafting', block: 'photo' }}
          overlay={<Carry x={128} y={121} label='Photo' />}
        />
      </Zoom>
      <Zoom x={998} y={62} z={1.02} w={300} h={620}>
        <Phone>
          <DonorMobile />
        </Phone>
      </Zoom>
    </Backdrop>
  );
}

function BriefStill() {
  return (
    <Backdrop color={C.peach}>
      <Zoom x={112} y={50} z={1.6} w={760} h={500}>
        <BrowserWindow url='openhand.org/pages/new' style={{ width: u(760), height: u(500) }}>
          <BriefScreen />
        </BrowserWindow>
      </Zoom>
    </Backdrop>
  );
}

function CanvasStill() {
  const state = draftWith(
    { hero: 'pending', goal: 'pending', story: 'drafting' },
    { hero: 2 }
  );
  return (
    <Backdrop color={C.vermilion}>
      <Zoom x={100} y={60} z={2} w={620} h={390}>
        <EditorWindow
          width={620}
          height={360}
          state={state}
          status={{ kind: 'paused' }}
          overlay={
            <>
              <StillCursor x={118} y={222} label='Paused, your turn' />
              <StillCursor x={318} y={30} label='Dolores' color={C.ink} />
            </>
          }
        />
      </Zoom>
    </Backdrop>
  );
}

const reviewState = draftWith(
  { hero: 'kept', goal: 'pending', story: 'pending', photo: 'kept', donate: 'pending' },
  { hero: 0, story: 1 }
);

function ReviewStill() {
  return (
    <Backdrop color={C.cream}>
      <Zoom x={112} y={50} z={1.6} w={760} h={500}>
        <EditorWindow
          width={760}
          height={470}
          canvasTop={54}
          state={reviewState}
          panel={<ReviewPanel state={reviewState} />}
          panelWidth={262}
        />
      </Zoom>
    </Backdrop>
  );
}

function NumbersStill() {
  return (
    <Backdrop color={C.vermilion}>
      <Zoom x={250} y={93} z={2} w={470} h={357}>
        <EmptyGoalCard />
      </Zoom>
    </Backdrop>
  );
}

function HistoryStill() {
  const state = draftWith(
    { hero: 'kept', goal: 'kept', story: 'kept', photo: 'kept', donate: 'pending' },
    { hero: 0 }
  );
  return (
    <Backdrop color={C.peach}>
      <Zoom x={112} y={50} z={1.6} w={760} h={500}>
        <EditorWindow width={760} height={470} canvasTop={54} state={state} panel={<HistoryPanel />} panelWidth={262} />
      </Zoom>
    </Backdrop>
  );
}

function DonorMobileStill() {
  return (
    <Backdrop color={C.peach}>
      <Zoom x={337} y={57} z={1.75} w={300} h={620}>
        <Phone>
          <DonorMobile />
        </Phone>
      </Zoom>
    </Backdrop>
  );
}

function DonorDesktopStill() {
  return (
    <Backdrop color={C.peach}>
      <Zoom x={56} y={190} z={1.7} w={640} h={482}>
        <BrowserWindow url='openhand.org/riverside-roof' style={{ width: u(640), height: u(482) }}>
          <DonorDesktop width={640} height={452} />
        </BrowserWindow>
      </Zoom>
    </Backdrop>
  );
}

export const stills: Still[] = [
  { key: 'cover', width: 1440, height: 756, render: () => <Cover /> },
  { key: 'brief', width: 1440, height: 900, render: () => <BriefStill /> },
  { key: 'canvas', width: 1440, height: 900, render: () => <CanvasStill /> },
  { key: 'review', width: 1440, height: 900, render: () => <ReviewStill /> },
  { key: 'numbers', width: 1440, height: 900, render: () => <NumbersStill /> },
  { key: 'history', width: 1440, height: 900, render: () => <HistoryStill /> },
  { key: 'donorMobile', width: 1200, height: 1200, render: () => <DonorMobileStill /> },
  { key: 'donorDesktop', width: 1200, height: 1200, render: () => <DonorDesktopStill /> }
];
