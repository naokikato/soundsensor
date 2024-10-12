/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon="" block="音センサ"
namespace IML_soundsensor {

    //% block
    //% block="音の大きさ %pin"
    //% weight=100
    export function getSoundwithPin(pin: AnalogPin): number {
        return getsound(pin)
    }

    function getsound(pin: AnalogPin): number {
        let sound = 0;
        for (let i = 0; i < 32; i++) {
            sound += pins.analogReadPin(pin)
        }
        sound >>= 5
        return Math.round(sound / 1024.0 * 1000.0) / 10.0
    }



    let datapin = AnalogPin.P0
    const SOUND_EVENT_ID1 = 1001;
    const SOUND_EVENT_ID2 = 1002;
    let threshold1 = 70;
    let threshold2 = 40;
    let interval = 100;

    //% block
    //% block="%pin につなげた音センサの閾値の上を $value1 下を $value2 に設定する"
    //% weight=90 color=#3fbc41
    export function setSoundSensor(pin: AnalogPin, value1: number, value2: number) {
        datapin = pin
        threshold1 = value1;
        threshold2 = value2;
        startListening();
    }
    //% block
    //% block="音センサの出力が閾値以上になったとき"
    //% weight=89 color=#3fbc41
    export function onSoundDetected1(handler: () => void) {
        control.onEvent(SOUND_EVENT_ID1, EventBusValue.MICROBIT_EVT_ANY, handler);
    }
    //% block
    //% block="音センサの出力が閾値以下になったとき"
    //% weight=88 color=#3fbc41
    export function onSoundDetected2(handler: () => void) {
        control.onEvent(SOUND_EVENT_ID2, EventBusValue.MICROBIT_EVT_ANY, handler);
    }

    // イベントリスナーの開始
    function startListening() {
        control.inBackground(() => {
            while (true) {
                let Level = getsound(datapin);
                if (Level >= threshold1) {
                    // イベントを発生させる
                    control.raiseEvent(SOUND_EVENT_ID1, Level);
                }
                if (Level <= threshold2) {
                    // イベントを発生させる
                    control.raiseEvent(SOUND_EVENT_ID2, Level);
                }
                basic.pause(interval);
            }
        });
    }
}
