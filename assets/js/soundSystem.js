(function() {

	var SoundSystem = function(inVoiceMode){

		this.engine = document.createElement('audio');
		this.gun = document.createElement('audio');
		this.music = document.createElement('audio');
		this.asteroidExplode = document.createElement('audio');
		this.shipExplode = document.createElement('audio');
		//Setting sources
		if(inVoiceMode){
			this.engine.setAttribute('src', '/sound/shipAccelerate_voice.mp3');
			this.gun.setAttribute('src', '/sound/shipGun_voice.mp3');
			this.asteroidExplode.setAttribute('src', '/sound/asteroidExplosion_voice.mp3');
			this.shipExplode.setAttribute('src', '/sound/shipExplosion_voice.mp3');
		}
		else{
			//Set to non-voice files
		}
		this.music.setAttribute('src', '/sound/MOONDARK_PROJECT_-_PSY4_EVOLUTIONS.mp3');

		//Set loops
		this.engine.loop = true;
		this.music.loop = true;

		//Set volumes
		this.music.volume=0.2;
		this.engine.volume=0.3;
		//Begin music
		this.music.play();
	}
	window.SpaceRocks.SoundSystem = SoundSystem;

})();