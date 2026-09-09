// Tactile Web Audio API Sound Engine
// Synthesizes analog mechanical clicks, mode switches, terminal ticks, and continuous tone scrubbing.

class TactileSoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;
  private activeOsc: OscillatorNode | null = null;
  private activeGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(state: boolean) {
    this.enabled = state;
    if (state) {
      this.initContext();
    } else {
      this.stopContinuousTone();
    }
  }

  public isSoundEnabled(): boolean {
    return this.enabled;
  }

  // Tactile Mechanical Relay Click
  public relayClick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, this.ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.24, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Ignore audio synthesis errors in restricted contexts
    }
  }

  // Mechanical Rotary Mode Shift
  public modeSwitch() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Primary crisp transient
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(220, now + 0.02);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.025);

      // Low mechanical thud
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(180, now + 0.015);
      osc2.frequency.exponentialRampToValueAtTime(40, now + 0.05);
      gain2.gain.setValueAtTime(0.22, now + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.015);
      osc2.stop(now + 0.055);
    } catch {
      // Ignore audio synthesis errors in restricted contexts
    }
  }

  // Terminal keystroke tick
  public tick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(1100, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.01);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.012);
    } catch {
      // Ignore audio synthesis errors in restricted contexts
    }
  }

  // Continuous Analog Signal Synthesizer (for the oscilloscope)
  public startContinuousTone(frequency: number, type: OscillatorType = "sine") {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    if (this.activeOsc) {
      this.updateToneFrequency(frequency);
      return;
    }

    try {
      this.activeOsc = this.ctx.createOscillator();
      this.activeGain = this.ctx.createGain();

      this.activeOsc.type = type;
      this.activeOsc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      this.activeGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.activeGain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 0.03);

      this.activeOsc.connect(this.activeGain);
      this.activeGain.connect(this.ctx.destination);

      this.activeOsc.start();
    } catch {
      // Audio node errors
    }
  }

  public updateToneFrequency(frequency: number) {
    if (!this.enabled || !this.ctx || !this.activeOsc) return;
    try {
      this.activeOsc.frequency.setTargetAtTime(frequency, this.ctx.currentTime, 0.03);
    } catch {}
  }

  public stopContinuousTone() {
    if (!this.ctx || !this.activeOsc || !this.activeGain) return;
    try {
      this.activeGain.gain.setValueAtTime(this.activeGain.gain.value, this.ctx.currentTime);
      this.activeGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      const osc = this.activeOsc;
      setTimeout(() => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      }, 50);
    } catch {}
    this.activeOsc = null;
    this.activeGain = null;
  }
}

export const soundEngine = new TactileSoundEngine();
