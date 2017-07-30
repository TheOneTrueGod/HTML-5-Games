const TurnPhasesEnum = {
  PLAYER_ACTION_1: 'player_action_1',
  PLAYER_ACTION_2: 'player_action_2',
  PLAYER_ACTION_3: 'player_action_3',
  PLAYER_ACTION_4: 'player_action_4',
  ENEMY_ACTION: 'enemy_action',
  ENEMY_MOVE: 'enemy_move',
  ENEMY_SPAWN: 'enemy_spawn',
  NEXT_TURN: 'next_turn',
}

TurnPhasesEnum.getNextPhase = function(currentPhase) {
  switch (currentPhase) {
    case TurnPhasesEnum.PLAYER_ACTION_1:
      return TurnPhasesEnum.PLAYER_ACTION_2;
    case TurnPhasesEnum.PLAYER_ACTION_2:
      return TurnPhasesEnum.PLAYER_ACTION_3;
    case TurnPhasesEnum.PLAYER_ACTION_3:
      return TurnPhasesEnum.PLAYER_ACTION_4;
    case TurnPhasesEnum.PLAYER_ACTION_4:
      return TurnPhasesEnum.ENEMY_ACTION;
    case TurnPhasesEnum.ENEMY_ACTION:
      return TurnPhasesEnum.ENEMY_MOVE;
    case TurnPhasesEnum.ENEMY_MOVE:
      return TurnPhasesEnum.ENEMY_SPAWN;
    case TurnPhasesEnum.ENEMY_SPAWN:
      return TurnPhasesEnum.NEXT_TURN;
  }
}

TurnPhasesEnum.isPlayerCommandPhase = function(phase) {
  return phase == TurnPhasesEnum.PLAYER_ACTION_1 ||
    phase == TurnPhasesEnum.PLAYER_ACTION_2 ||
    phase == TurnPhasesEnum.PLAYER_ACTION_3 ||
    phase == TurnPhasesEnum.PLAYER_ACTION_4;
}
