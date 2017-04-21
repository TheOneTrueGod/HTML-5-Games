module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: [
          'src/Events/*.js',
          'src/Game/*.js',
          'src/AI/*.js',
          'src/Effects/Effect.js', 'src/Effects/*.js',
          'src/ShipComponents/*.js',
            'src/ShipComponents/Weapons/Weapons.js',
            'src/ShipComponents/**/*.js',
          'src/SpaceObjects/*.js',
            'src/SpaceObjects/Ships/Ship.js',
            'src/SpaceObjects/**/*.js',
          'src/Projectiles/*.js',
          'src/ShipFactory/*.js',
          'src/UI/Screen.js',
          'src/UI/*.js',
            'src/UI/UIComponents/*.js',
            'src/UI/**/*.js',
          'src/Game/Missions/MissionDef.js',
          'src/*.js'
        ],
        dest: 'dist/built.js',
      },
    },
    watch: {
      scripts: {
        files: ['src/**/*.js', 'src/*.js'],
        tasks: ['concat'],
        options: {
          spawn: false,
        },
      },
    },
  });

  // Default task(s).
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat']);

};
