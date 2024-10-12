/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon="" block="音センサ v1.7"
namespace IML_soundsensor {

    let datapin = AnalogPin.P0

    //% block
    //% block="音センサのピンを設定する %pin"
    //% weight=100   
    export function setPin(pin: AnalogPin): void{
        datapin = pin;
    }
    //% block
    //% block="音の大きさ %pin"
    //% weight=99   
    export function getSoundwithPin(pin: AnalogPin): number {
        return getsound(pin)
    }
    //% block
    //% block="音の大きさ"
    //% weight=98   
    export function getSound(): number {
        return getsound(datapin)
    }

    /**
     * センサーのピンを設定し、指定された閾値でイベントを発生させる
     * @param value 閾値
     */
    //% block="音センサの閾値を $value に設定する"
    //% weight=90   color =#3fbc41
    export function setSoundSensor(value: number) {
        threshold = value;
        startListening();
    }

    /**
     * 音センサの出力が閾値以上になったときに実行する
     * @param handler イベントが発生したときに実行するコード
     */
    //% block="音センサの出力が閾値以上になったとき"
    //% weight=90   color =#3fbc41
    export function onSoundDetected(handler: () => void) {
        control.onEvent(SOUND_EVENT_ID, EventBusValue.MICROBIT_EVT_ANY, handler);
    }


    function getsound(pin: AnalogPin): number {
        let sound = 0;
        for (let i = 0; i < 32; i++) {
            sound += pins.analogReadPin(pin)
        }
        sound >>= 5
        return Math.round(sound / 1024.0 * 1000.0) / 10.0
    }

    const SOUND_EVENT_ID = 1000;
    let threshold = 50;
    let interval = 100;

    // イベントリスナーの開始
    function startListening() {
        control.inBackground(() => {
            while (true) {
                let soundLevel = pins.analogReadPin(datapin);
                if (soundLevel >= threshold) {
                    // イベントを発生させる
                    control.raiseEvent(SOUND_EVENT_ID, soundLevel);
                }
                basic.pause(interval);
            }
        });
    }
}
