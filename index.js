var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;

	self.actions();
}

instance.prototype.init = function() {
	var self = this;

	self.status(self.STATE_OK);

	debug = self.debug;
	log = self.log;
}

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP/Host',
			width: 6,
//			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port (Default: 8045)',
			width: 3,
			default: 8045,
			regex: self.REGEX_PORT
		},
	]
}

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;
	debug("destroy");
}

instance.prototype.CHOICES_CHANNELS = [
	{ id: '0', label: 'CH 1' },
	{ id: '1', label: 'CH 2' },
	{ id: '2', label: 'CH 3' },
	{ id: '3', label: 'CH 4' },
];

instance.prototype.CHOICES_ENCODER = [
	{ id: '0', label: 'Encoder 1' },
	{ id: '1', label: 'Encoder 2' },
];

instance.prototype.CHOICES_VIDEO_MODE = [
	{ id: '-1', label: 'Unknown' },
	{ id: '0', 	label: 'PAL' },
	{ id: '1', 	label: 'NTSC' },
	{ id: '2', 	label: 'HD 720p50' },
	{ id: '3', 	label: 'HD 720p59.94' },
	{ id: '4', 	label: 'HD 1080i50' },
	{ id: '5', 	label: 'HD 1080i59.94' },
];

instance.prototype.CHOICES_PRESET = [
	{ id: '0', label: 'Preset 1' },
	{ id: '1', label: 'Preset 2' },
	{ id: '2', label: 'Preset 3' },
	{ id: '3', label: 'Preset 4' },
];


instance.prototype.actions = function(system) {
	var self = this;

	self.setActions({
		'pgm_status': {
			label: 'PGM Status',
		},
		'rec_status': {
			label: 'Record Status',
			options: [
				{
					type: 'dropdown',
					id: 'ch',
					label: 'Channel:',
					default: '0',
					choices: self.CHOICES_CHANNELS
				}
			]
		},
		'rec_start': {
			label: 'Recording Start',
			options: [
				{
					type: 'dropdown',
					id: 'ch',
					label: 'Channel:',
					default: '0',
					choices: self.CHOICES_CHANNELS
				},
				{
					type: 'textinput',
					id: 'recname',
					label: 'Rec Name:',
					default: ''
				}
			]
		},
		'rec_stop': {
			label: 'Recording Stop',
			options: [
				{
					type: 'dropdown',
					id: 'ch',
					label: 'Channel:',
					default: '0',
					choices: self.CHOICES_CHANNELS
				}
			]
		},
		'rec_split': {
			label: 'Recording Split',
			options: [
				{
					type: 'dropdown',
					id: 'ch',
					label: 'Channel:',
					default: '0',
					choices: self.CHOICES_CHANNELS
				}
			]
		},
		'rec_mark': {
			label: 'Recording Mark',
			options: [
				{
					type: 'dropdown',
					id: 'ch',
					label: 'Channel:',
					default: '0',
					choices: self.CHOICES_CHANNELS
				}
			]
		},
		'rec_preset': {
			label: 'Recording Preset',
			options: [
				{
					type: 'dropdown',
					id: 'ch',
					label: 'Channel:',
					default: '0',
					choices: self.CHOICES_CHANNELS
				},
				{
					type: 'dropdown',
					id: 'encoder',
					label: 'Encoder:',
					default: '0',
					choices: self.CHOICES_ENCODER
				},
				{
					type: 'dropdown',
					id: 'video_mode',
					label: 'Video Mode:',
					default: '-1',
					choices: self.CHOICES_VIDEO_MODE
				},
				{
					type: 'dropdown',
					id: 'preset',
					label: 'Preset ID:',
					default: '0',
					choices: self.CHOICES_PRESET
				}
			]
		},
		'rec_time': {
			label: 'Recording Add Time',
			options: [
				{
					type: 'dropdown',
					id: 'ch',
					label: 'Channel:',
					default: '0',
					choices: self.CHOICES_CHANNELS
				},
				{
					type: 'number',
					id: 'time',
					label: 'Time In Seconds:',
					min: 0,
					default: 10,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				}
			]
		},

	});
}

instance.prototype.action = function(action) {
	var self = this;
	var c = self.config;
	var o = action.options;
	var pack_cmd;
	var pack_body;
	var pack_type;
	var pack_url;

	switch(action.action) {

		case 'pgm_status':
			pack_type = 'get';
			pack_cmd = '/program/status';
			break;
	
		case 'rec_status':
			pack_type = 'get';
			pack_cmd = '/recording/status';
			pack_body = '{"channel": ' + o.ch + '}';
			break;
	
		case 'rec_start':
			pack_type = 'post';
			pack_cmd = '/recording/rec';
			pack_body = '{"channel": ' + o.ch + ', "recname": "' + o.recname + '"}';
			break;

		case 'rec_stop':
			pack_type = 'post';
			pack_cmd = '/recording/stop';
			pack_body = '{"channel": ' + o.ch + '}';
			break;

		case 'rec_split':
			pack_type = 'post';
			pack_cmd = '/recording/split';
			pack_body = '{"channel": ' + o.ch + '}';
			break;

		case 'rec_mark':
			pack_type = 'post';
			pack_cmd = '/recording/mark';
			pack_body = '{"channel": ' + o.ch + '}';
			break;
			
		case 'rec_preset':
			pack_type = 'post';
			pack_cmd = '/recording/preset';
			pack_body = '{"channel": ' + o.ch + ', "encoder": ' + o.encoder + ', "videomode": ' + o.video_mode + ', "preset": ' + o.preset + '}';
			break;

		case 'rec_time':
			pack_type = 'post';
			pack_cmd = '/recording/time/add';
			pack_body = '{"channel": ' + o.ch + ', "time": ' + o.time + '}';
			break;
	
	}

	pack_url = 'http://' + c.host +  ':' + c.port + pack_cmd;

	if (pack_type == 'post') {
		var json_body;
		try {
			json_body = JSON.parse(pack_body);
		} catch(e){
			console.log('error', 'HTTP POST Request aborted: Malformed JSON Body (' + e.message+ ')');
			self.status(self.STATUS_ERROR, e.message);
			return
		}
		self.system.emit('rest', pack_url, json_body, function (err, result) {
			if (err !== null) {
				console.log('error', 'HTTP POST Request failed (' + result.error.code + ')');
				self.status(self.STATUS_ERROR, result.error.code);
			}
			else {
				console.log('OK', 'HTTP Response: ');
				console.log("%j", result.data.toString('utf8')); // Show Rough recived data in console
				self.status(self.STATUS_OK);
			}
		});
	}
	else if (pack_type == 'get') {

		self.system.emit('rest_get', pack_url, function (err, result) {
			if (err !== null) {
				console.log('error', 'HTTP GET Request failed (' + result.error.code + ')');
				self.status(self.STATUS_ERROR, result.error.code);
			}
			else {
				console.log('OK', 'HTTP Response: ');
				console.log("%j", result.data.toString('utf8')); // Show Rough recived data in console
				self.status(self.STATUS_OK);
			}
		});
	}

}

instance_skel.extendedBy(instance);
exports = module.exports = instance;
