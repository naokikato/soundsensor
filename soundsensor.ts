/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon="" block="音センサ v1.7"
namespace IMLsoundsensor {

    //% block
    //% block="音の大きさ %pin"
    //% weight=100   
    export function getLight(pin: AnalogPin): number {
        let sound = 0;
        for( let i=0 ; i < 32 ; i++)
        {
            sound += pins.analogReadPin(pin)
        }
        sound >>= 5
        return Math.round( sound / 1024.0 * 1000.0) / 10.0
    }
}
