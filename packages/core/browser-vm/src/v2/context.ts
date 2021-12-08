import Stage from './stage';

class Context {
  location: string;

  stage: Stage;

  constructor() {
    // this.location = '1';
    this.stage = new Stage();
  }
}
