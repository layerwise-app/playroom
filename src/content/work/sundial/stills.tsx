import type { ReactNode } from 'react';
import { BrowserWindow, Phone } from '~/components/frames';
import { u } from '~/components/stage';
import type { Still } from '~/content/stills';
import { AvailabilityScreen } from './screens/availability';
import { ConflictPopover, ConflictScreen } from './screens/conflict';
import { AskEmail, FamilyScreen } from './screens/family';
import { PublishScreen } from './screens/publish';
import { RoomsScreen } from './screens/rooms';
import { SpreadsheetScreen } from './screens/spreadsheet';
import { WeekScreen } from './screens/week';
import { fontFamily, palette } from './theme';

function Desk({ children, url }: { children: ReactNode; url: string }) {
  return (
    <div className='absolute inset-0' style={{ background: palette.cobalt, fontFamily }}>
      <BrowserWindow
        url={url}
        className='absolute'
        style={{ left: u(56), top: u(48), width: u(1328), height: u(804) }}
      >
        {children}
      </BrowserWindow>
    </div>
  );
}

function Cover() {
  return (
    <div className='absolute inset-0 overflow-hidden' style={{ background: palette.cobalt, fontFamily }}>
      <div className='absolute' style={{ left: u(60), top: u(64), transform: 'scale(0.7)', transformOrigin: '0 0' }}>
        <BrowserWindow url='sundial.fernwoodarts.org/fall-2024/week' style={{ width: u(1328), height: u(804) }}>
          <WeekScreen />
        </BrowserWindow>
      </div>
      <div className='absolute' style={{ left: u(1092), top: u(76), transform: 'scale(0.66)', transformOrigin: '0 0' }}>
        <Phone width={430} height={940} screen='#F5F6FA'>
          <FamilyScreen />
        </Phone>
      </div>
      <div className='absolute' style={{ left: u(640), top: u(372), transform: 'scale(0.78)', transformOrigin: '0 0' }}>
        <ConflictPopover notch={false} style={{ position: 'relative' }} />
      </div>
    </div>
  );
}

export const stills: Still[] = [
  { key: 'cover', width: 1440, height: 756, render: () => <Cover /> },
  {
    key: 'week',
    width: 1440,
    height: 900,
    render: () => (
      <Desk url='sundial.fernwoodarts.org/fall-2024/week'>
        <WeekScreen />
      </Desk>
    )
  },
  {
    key: 'spreadsheet',
    width: 1440,
    height: 900,
    render: () => (
      <Desk url='gridsheet.app/d/1Fw8QxT0/edit#gid=0'>
        <SpreadsheetScreen />
      </Desk>
    )
  },
  {
    key: 'conflict',
    width: 1440,
    height: 900,
    render: () => (
      <div className='absolute inset-0 overflow-hidden' style={{ background: palette.cobalt, fontFamily }}>
        <div
          className='absolute overflow-hidden'
          style={{
            left: u(72),
            top: u(72),
            borderRadius: u(16),
            transform: 'scale(1.16)',
            transformOrigin: '0 0',
            boxShadow: `0 ${u(30)} ${u(70)} ${u(-30)} rgba(8,18,70,.7)`
          }}
        >
          <ConflictScreen />
        </div>
      </div>
    )
  },
  {
    key: 'availability',
    width: 1440,
    height: 900,
    render: () => (
      <Desk url='sundial.fernwoodarts.org/teachers/rosa-ortega'>
        <AvailabilityScreen />
      </Desk>
    )
  },
  {
    key: 'rooms',
    width: 1440,
    height: 900,
    render: () => (
      <Desk url='sundial.fernwoodarts.org/fall-2024/rooms/tue'>
        <RoomsScreen />
      </Desk>
    )
  },
  {
    key: 'publish',
    width: 1200,
    height: 1200,
    render: () => (
      <div className='absolute inset-0' style={{ background: palette.ice, fontFamily }}>
        <div
          className='absolute overflow-hidden'
          style={{
            left: u(100),
            top: u(100),
            borderRadius: u(18),
            boxShadow: `0 0 0 1px rgba(22,48,143,.08), 0 ${u(30)} ${u(60)} ${u(-30)} rgba(22,48,143,.45)`
          }}
        >
          <PublishScreen />
        </div>
      </div>
    )
  },
  {
    key: 'familyMobile',
    width: 1200,
    height: 1200,
    render: () => (
      <div className='absolute inset-0' style={{ background: palette.ice, fontFamily }}>
        <Phone width={430} height={940} screen='#F5F6FA' className='absolute' style={{ left: u(580), top: u(130) }}>
          <FamilyScreen />
        </Phone>
        <div className='absolute' style={{ left: u(130), top: u(420) }}>
          <AskEmail />
        </div>
      </div>
    )
  }
];
