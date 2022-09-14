class Sounds{
    static init(){
        this.crash = new Audio("./audio/crash.mp3")
        this.crash.volume = 0.2
        this.crash2 = new Audio("./audio/crash2.mp3")
        this.crash2.volume = 0.2
        this.crash3 = new Audio("./audio/crash3.mp3")
        this.crash3.volume = 0.3

        this.hit = new Audio("./audio/crash3.mp3")
        this.hit.volume = 0.2;

        this.propeller = new Audio("./audio/propeller.mp3")
        this.propeller.volume = 0.4;
        this.propeller_start = new Audio("./audio/propeller_start.mp3")
        this.propeller_start.volume = 0.4;
        this.propeller_stop = new Audio("./audio/propeller_stop.mp3")
        this.propeller_stop.volume = 0.4;

        this.rocket_short = new Audio("./audio/rocket_short.mp3")
        this.rocket_short.volume = 0.3;
        this.rocket_med = new Audio("./audio/rocket_med.mp3")
        this.rocket_med.volume = 0.3;
        this.rocket_long = new Audio("./audio/rocket_long.mp3")
        this.rocket_long.volume = 0.3;

        this.ride = new Audio("./audio/ride.mp3")

        this.ambient_day = new Audio("./audio/ambient2.mp3")
        this.ambient_day.volume = 0.05

        this.ambient_night = new Audio("./audio/ambient_night.mp3")
        this.ambient_night.volume = 0.05

        this.bell = new Audio("./audio/bell.mp3")
        this.bell.volume = 0.5

        setInterval(() => {
            if(this.propellerPlaying){
                this.propeller.play()
            }
        }, 10)
    }

    static ringBell(){
        this.bell.play();
    }

    static playHit(){
        this.hit.play();
    }

    static playCrash(){
        var n = Math.floor(Math.random() * 3)
        switch(n){
            case 0:
                this.crash.play()
                break;
            case 1:
                this.crash2.play()
                break;
            case 2:
                this.crash3.play()
                break;
        }
    }
    static startPropeller(){
        this.propeller_start.play()
        setTimeout(() => {
            this.propellerPlaying = true;
            this.propeller.play()
        }, 50)
        
    }

    static stopPropeller(){
        this.propellerPlaying = false;
        this.propeller_start.pause();
        this.propeller.pause();
        this.propeller_stop.play();
    }
    
    static playRocketLong(){
        this.rocket_short.pause();
        this.rocket_med.pause();
        this.rocket_long.play();
    }

    static playRocketMed(){
        this.rocket_short.pause();
        this.rocket_med.play();
    }

    static playRocketShort(){
        this.rocket_short.play();
    }

    static playAmbient(night = false){
        if(!night){
            this.ambient_day.play();
        } else {
            this.ambient_night.play();
        }
    }

    static playRide(){
        this.ride.volume = 0.4
        this.ride.play();
    }

    static stopRide(){
        this.fadeOut(this.ride)
    }

    static stopGameSounds(){
        this.crash.pause()
        this.crash2.pause()
        this.crash3.pause()

        this.propellerPlaying = false;
        this.propeller.pause()
        this.propeller_start.pause()
        this.propeller_stop.pause()

        this.rocket_short.pause()
        this.rocket_med.pause()
        this.rocket_long.pause()
    }

    static fadeOut(sound){
        var interval = setInterval(() => {
            sound.volume *= 0.99
            if(sound.volume < 0.01){
                sound.pause();
                window.clearInterval(interval)
            }
        }, 100)
    }
}