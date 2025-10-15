/**
 * @file xtark.ts
 * @n This is a MakeCode graphical programming education robot.
 * @date  2025-10-15
*/
let alreadyInit = 0
let IrPressEvent = 0

enum PingUnit {
    //% block="厘米"
    Centimeters,
}
enum state {
    state1 = 0x10,
    state2 = 0x11,
    state3 = 0x20,
    state4 = 0x21
}
interface KV {
    key: state;
    action: Action;
}


//%
//% weight=100 color=#008B00 icon="\uf136" block="xtark"
namespace xtark {
    export class Packeta {
        public mye: string;
        public myparam: number;
    }

    export enum Motors {
        //% blockId="left motor" block="左电机"
        M1 = 0,
        //% blockId="right motor" block="右电机"
        M2 = 1,
        //% blockId="all motor" block="全部"
        All = 2
    }

    export enum Servos {
        //% blockId="S1" block="舵机1"
        S1 = 0,
        //% blockId="S2" block="舵机2"
        S2 = 1
    }

    export enum Dir {
        //% blockId="CW" block="正向"
        CW = 0,
        //% blockId="CCW" block="逆向"
        CCW = 1
    }

    export enum Patrol {
        //% blockId="patrol1" block="巡线传感器1"
        Patrol1 = 0,
        //% blockId="patrol2" block="巡线传感器2"
        Patrol2 = 1,
        //% blockId="patrol3" block="巡线传感器3"
        Patrol3 = 2,
        //% blockId="patrol4" block="巡线传感器4"
        Patrol4 = 3
    }



    let state1 = 0;
    /**
     * Read ultrasonic sensor.
     */

    //% blockId=ultrasonic_sensor block="以厘米为单位读取超声波传感器"
    //% weight=95
    export function Ultrasonic(): number {
        let data;
        let i = 0;
        data = readUlt(PingUnit.Centimeters);
        if (state1 == 1 && data != 0) {
            state1 = 0;
        }
        if (data != 0) {
        } else {
            if (state1 == 0) {
                do {
                    data = readUlt(PingUnit.Centimeters);
                    i++;
                    if (i > 3) {
                        state1 = 1;
                        data = 500;
                        break;
                    }
                } while (data == 0)
            }
        }
        if (data == 0)
            data = 500
        return data;

    }
    function readUlt(unit: number): number {
        let d
        pins.digitalWritePin(DigitalPin.P12, 1);
        basic.pause(1)
        pins.digitalWritePin(DigitalPin.P12, 0);
        if (pins.digitalReadPin(DigitalPin.P4) == 0) {
            pins.digitalWritePin(DigitalPin.P12, 0);
            pins.digitalWritePin(DigitalPin.P12, 1);
            basic.pause(20)
            pins.digitalWritePin(DigitalPin.P12, 0);
            d = pins.pulseIn(DigitalPin.P4, PulseValue.High, 500 * 58);//readPulseIn(1);
        } else {
            pins.digitalWritePin(DigitalPin.P12, 1);
            pins.digitalWritePin(DigitalPin.P12, 0);
            basic.pause(20)
            pins.digitalWritePin(DigitalPin.P12, 0);
            d = pins.pulseIn(DigitalPin.P4, PulseValue.Low, 500 * 58);//readPulseIn(0);
        }
        let x = d / 59;
        switch (unit) {
            case PingUnit.Centimeters: return Math.round(x);
            default: return Math.idiv(d, 2.54);
        }
    }

    /**
     * Set the direction and speed of xtark motor.
     * @param index Motor to run
     * @param direction Wheel direction
     * @param speed Wheel speed
     */

    //% weight=90
    //% blockId=motor_MotorRun block="motor|%index|move|%Dir|at speed|%speed"
    //% speed.min=0 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function motorRun(index: Motors, direction: Dir, speed: number): void {
        let buf = pins.createBuffer(3);
        if (index == 0) {
            buf[0] = 0;
            buf[1] = direction;
            buf[2] = speed;
            if (buf[1] == 0) {
                pins.analogWritePin(AnalogPin.P16, buf[2]);
            }
            else if (buf[1] == 1) {
                pins.analogWritePin(AnalogPin.P15, buf[2]);
            }
        }
        if (index == 1) {
            buf[0] = 0;
            buf[1] = direction;
            buf[2] = speed;
            if (buf[1] == 0) {
                pins.analogWritePin(AnalogPin.P13, buf[2]);
            }
            else if (buf[1] == 1) {
                pins.analogWritePin(AnalogPin.P14, buf[2]);
            }
        }
        if (index == 2) {
            buf[0] = 0;
            buf[1] = direction;
            buf[2] = speed;
            if (buf[1] == 0) {
                pins.analogWritePin(AnalogPin.P13, buf[2]);
                pins.analogWritePin(AnalogPin.P16, buf[2]);
            }
            else if (buf[1] == 1) {
                pins.analogWritePin(AnalogPin.P14, buf[2]);
                pins.analogWritePin(AnalogPin.P15, buf[2]);
            }
        }
    }

    /**
     * Stop the motor.
     * @param motors The motor to stop
     */

    //% weight=20
    //% blockId=motor_motorStop block="电机 |%motors 停止"
    //% motors.fieldEditor="gridpicker" motors.fieldOptions.columns=2
    export function motorStop(motors: Motors): void {
        let buf = pins.createBuffer(3);
        if (motors == 0) {
            pins.digitalWritePin(DigitalPin.P15, 0);
            pins.digitalWritePin(DigitalPin.P16, 0);
        }
        if (motors == 1) {
            pins.digitalWritePin(DigitalPin.P14, 0);
            pins.digitalWritePin(DigitalPin.P13, 0);
        }

        if (motors == 2) {
            pins.digitalWritePin(DigitalPin.P15, 0);
            pins.digitalWritePin(DigitalPin.P16, 0);
            pins.digitalWritePin(DigitalPin.P14, 0);
            pins.digitalWritePin(DigitalPin.P13, 0);
        }

    }

    /**
     * Read line tracking sensor.
     * @param patrol The patrol sensor to read
     */

    //% weight=20
    //% blockId=read_Patrol block="读取 |%patrol 巡线传感器"
    export function readPatrol(patrol: Patrol): number {
        if (patrol == Patrol.Patrol1) {
            return pins.analogReadPin(AnalogPin.P0)
        } else if (patrol == Patrol.Patrol2) {
            return pins.analogReadPin(AnalogPin.P1)
        } else if (patrol == Patrol.Patrol3) {
            return pins.analogReadPin(AnalogPin.P2)
        } else if (patrol == Patrol.Patrol4) {
            return pins.analogReadPin(AnalogPin.P3)
        } else {
            return -1
        }
    }



    /**
     * Set the servos.
     * @param index Servo channel
     * @param angle Servo angle; eg: 90
     */

    //% weight=90
    //% blockId=servo_ServoRun block="舵机|%index|角度|%angle"
    //% angle.min=0 angle.max=180
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function servoRun(index: Servos, angle: number): void {
        let an = angle;
        if (index == 0) {
            pins.servoWritePin(AnalogPin.P8, an)
        }
        if (index == 1) {
            pins.servoWritePin(AnalogPin.P9, an)
        }
    }


}
