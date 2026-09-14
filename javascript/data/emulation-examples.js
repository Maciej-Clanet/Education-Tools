// Fixed conceptual paths: native references run on compatible target hardware.
export const emulationExamples = {
  retro: {
    context: {
      emulated: 'Old game on a modern PC: keyboard input and graphics must appear as the target expects.',
      native: 'Native reference: the same game on its original compatible computer with its controller and graphics hardware.',
    },
    emulated: [
      ['Target software', 'Old game', 'The player wants the character to move right and the next image to appear.'],
      ['Target expectation', 'Controller + graphics', 'The game expects RIGHT from its controller and the drawing behaviour of its original graphics hardware.'],
      ['Emulator', 'Map input; recreate drawing', 'The emulator maps the host Right Arrow event to the target controller signal and recreates the target drawing behaviour.'],
      ['Host behaviour', 'PC performs the work', 'The real host CPU and graphics hardware do the work needed to present that behaviour.'],
      ['Result', 'Movement + next frame', 'The game receives the expected input; the host display presents the resulting image.'],
    ],
    native: [
      ['Program', 'Game on its own platform', 'The game runs on the original compatible target computer.'],
      ['Compatible hardware', 'Original controller + graphics', 'The controller supplies its own RIGHT signal and the graphics hardware performs the game’s drawing requests.'],
      ['Result', 'Movement + next frame', 'The original system displays the frame without an extra target-emulation layer.'],
    ],
  },
  legacy: {
    context: {
      emulated: 'An old stock application uses a recreated operating environment on maintained modern hardware.',
      native: 'Native reference: the application runs on a compatible original PC and operating system.',
    },
    emulated: [
      ['Target software', 'Stock application', 'The application asks its expected operating environment to read a saved stock record.'],
      ['Target expectation', 'Old OS + storage behaviour', 'The expected OS and storage device must return data in the way the program understands.'],
      ['Emulator', 'Recreate the old computer', 'A system emulator runs the old environment and reproduces required processor and storage-device behaviour.'],
      ['Host behaviour', 'Read host storage', 'Host operations read the stored system image and data while the emulator maintains the target’s device state.'],
      ['Result', 'Stock record returned', 'The application receives its record through the environment it expects. Required device support still needs checking.'],
    ],
    native: [
      ['Program', 'Stock application', 'The application runs on the original compatible PC and OS.'],
      ['Compatible platform', 'Original OS + storage', 'Its operating environment and storage hardware service the read request directly.'],
      ['Result', 'Stock record returned', 'The application receives its record without the extra recreated-machine layer.'],
    ],
  },
  arm: {
    context: {
      emulated: 'ARM target software runs through an emulator on an x86-64 developer PC.',
      native: 'Native reference: the ARM target software runs on a compatible real ARM device.',
    },
    emulated: [
      ['Target software', 'ARM target program', 'The developer runs a build written for the target processor and environment.'],
      ['Target expectation', 'ARM operation rules', 'The target program requests an operation according to its ARM instruction set.'],
      ['Emulator', 'Recreate the operation', 'The emulator works out the target meaning and translates or otherwise recreates its effect.'],
      ['Host behaviour', 'x86-64 host operations', 'The host CPU executes operations that produce the required target result; the emulator updates target state.'],
      ['Result', 'Target result available', 'The program can continue. This supports early testing, but does not establish exact real-device timing.'],
    ],
    native: [
      ['Program', 'ARM target program', 'The build runs on compatible ARM target hardware.'],
      ['Compatible processor', 'ARM hardware executes', 'The processor understands the target machine instructions; the device supplies its actual hardware behaviour.'],
      ['Result', 'Real-target result', 'The operation completes without translating it for a different host CPU. Other OS and device work can still exist.'],
    ],
  },
}

const messages = {
  incompleteMessage: 'Choose both an approach and a reason.',
  successMessage: 'That approach and reason fit this scenario.',
  retryMessage: 'Reconsider the approach and reason together.',
}
export const emulationScenarios = {
  museum: { ...messages, acceptedPairs: [['emulate', 'access']], explanation: 'Emulation can preserve access as original hardware becomes scarce; confirm support for the application and its environment.' },
  developer: { ...messages, acceptedPairs: [['emulate', 'early'], ['validate', 'early']], explanation: 'An emulator enables early target testing. When device-specific behaviour matters, validate on the real target later.' },
  native: { ...messages, acceptedPairs: [['native', 'performance']], explanation: 'A supported native version can avoid unnecessary emulation work; confirm that its features and data meet the requirements.' },
  industrial: { ...messages, acceptedPairs: [['validate', 'timing']], explanation: 'The answer needs both parts: emulation may support early work, but exact peripheral/timing behaviour needs real-hardware confirmation.' },
}
