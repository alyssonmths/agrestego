import { AppService } from './app.service';

describe('AppService', () => {
  it('CT-APP-02 - getHello deve retornar "Hello World!"', () => {
    const service = new AppService();

    expect(service.getHello()).toBe('Hello World!');
  });
});
