var PlayerComponent = IgeEntity.extend({
	classId: 'PlayerComponent',
	componentId: 'playerControl',

	init: function (entity, options) {
		var self = this;

		// Store the entity that this component has been added to
		this._entity = entity;

		// Store any options that were passed to us
		this._options = options;

		this.controls = {
			left: false,
			right: false,
			up: false,
			down: false
		};

		this._speed = 0.1;

		// Setup the control system
		ige.input.mapAction('left', ige.input.key.left);
		ige.input.mapAction('right', ige.input.key.right);
		ige.input.mapAction('up', ige.input.key.up);
		ige.input.mapAction('down', ige.input.key.down);

		// Add the playerComponent behaviour to the entity
		this._entity.addBehaviour('playerComponent_behaviour', this._behaviour);
		this._entity.team = Character.TEAM.PLAYER;
	},

	/**
	 * Called every frame by the engine when this entity is mounted to the
	 * scenegraph.
	 * @param ctx The canvas context to render to.
	 */
	_behaviour: function (ctx) {
		/* CEXCLUDE */
		if (ige.isServer) {
			var xSpeed = 0;
			var ySpeed = 0;

			if (this.playerControl.controls.left) {
				xSpeed += -this.playerControl._speed;
				//ySpeed += this.playerControl._speed;
			} else if (this.playerControl.controls.right) {
				xSpeed += this.playerControl._speed;
				//ySpeed += -this.playerControl._speed;
			}

			if (this.playerControl.controls.up) {
				//xSpeed += -this.playerControl._speed;
				ySpeed += -this.playerControl._speed;
			} else if (this.playerControl.controls.down) {
				//xSpeed += this.playerControl._speed;
				ySpeed += this.playerControl._speed;
			}

			if (xSpeed < -this.playerControl._speed) {
				xSpeed = -this.playerControl._speed;
			} else if (xSpeed > this.playerControl._speed) {
				xSpeed = this.playerControl._speed;
			}

			if (ySpeed < -this.playerControl._speed) {
				ySpeed = -this.playerControl._speed;
			} else if (ySpeed > this.playerControl._speed) {
				ySpeed = this.playerControl._speed;
			}
			this.velocity.x(xSpeed);
			this.velocity.y(ySpeed);
		}
		/* CEXCLUDE */

		if (ige.isClient) {
			if (ige.input.actionState('left')) {
				if (!this.playerControl.controls.left) {
					// Record the new state
					this.playerControl.controls.left = true;

					// Tell the server about our control change
					ige.network.send('playerControlLeftDown');
				}
			} else {
				if (this.playerControl.controls.left) {
					// Record the new state
					this.playerControl.controls.left = false;

					// Tell the server about our control change
					ige.network.send('playerControlLeftUp');
				}
			}

			if (ige.input.actionState('right')) {
				if (!this.playerControl.controls.right) {
					// Record the new state
					this.playerControl.controls.right = true;

					// Tell the server about our control change
					ige.network.send('playerControlRightDown');
				}
			} else {
				if (this.playerControl.controls.right) {
					// Record the new state
					this.playerControl.controls.right = false;

					// Tell the server about our control change
					ige.network.send('playerControlRightUp');
				}
			}

			if (ige.input.actionState('up')) {
				if (!this.playerControl.controls.up) {
					// Record the new state
					this.playerControl.controls.up = true;

					// Tell the server about our control change
					ige.network.send('playerControlUpDown');
				}
			} else {
				if (this.playerControl.controls.up) {
					// Record the new state
					this.playerControl.controls.up = false;

					// Tell the server about our control change
					ige.network.send('playerControlUpUp');
				}
			}

			if (ige.input.actionState('down')) {
				if (!this.playerControl.controls.down) {
					// Record the new state
					this.playerControl.controls.down = true;

					// Tell the server about our control change
					ige.network.send('playerControlDownDown');
				}
			} else {
				if (this.playerControl.controls.down) {
					// Record the new state
					this.playerControl.controls.down = false;

					// Tell the server about our control change
					ige.network.send('playerControlDownUp');
				}
			}
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerComponent; }
