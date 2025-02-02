const App = require("../src/App");
const MissionUtils = require("@woowacourse/mission-utils");

const mockQuestions = (answers) => {
  MissionUtils.Console.readLine = jest.fn();
  answers.reduce((acc, input) => {
    return acc.mockImplementationOnce((question, callback) => {
      callback(input);
    });
  }, MissionUtils.Console.readLine);
};

const mockRandoms = (numbers) => {
  MissionUtils.Random.pickNumberInRange = jest.fn();
  numbers.reduce((acc, number) => {
    return acc.mockReturnValueOnce(number);
  }, MissionUtils.Random.pickNumberInRange);
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, "print");
  logSpy.mockClear();
  return logSpy;
};

describe("숫자 야구 게임", () => {
  test("랜덤 숫자 생성", () => {
    const app = new App();
    app.generateGoalNumber();
    const isNumberTypeGoal = app.goal.every(
      (number) => typeof number === "number"
    );

    expect(app.goal.length).toEqual(3);
    expect(isNumberTypeGoal).toEqual(true);
  });

  test("Goal과 UserAnswer를 비교해 [볼 숫자, 스트라이크 숫자] 반환", () => {
    const app = new App();
    const GOAL = [1, 2, 3];
    const result = {
      threeStrike: [3, 0],
      oneStrikeAndTwoBall: [1, 2],
    };
    const answer = {
      threeStrike: GOAL,
      oneStrikeAndTwoBall: [1, 3, 2],
    };

    const [threeOut, oneBallAndOnwStrike] = [
      app.getStrikeAndBallCount(GOAL, answer.threeStrike),
      app.getStrikeAndBallCount(GOAL, answer.oneStrikeAndTwoBall),
    ];

    expect(threeOut).toEqual(result.threeStrike);
    expect(oneBallAndOnwStrike).toEqual(result.oneStrikeAndTwoBall);
  });

  test("게임 종료 후 재시작", () => {
    const randoms = [1, 3, 5, 5, 8, 9];
    const answers = ["246", "135", "1", "597", "589", "2"];
    const logSpy = getLogSpy();
    const messages = [
      "낫싱",
      "3스트라이크",
      "1볼 1스트라이크",
      "3스트라이크",
      "게임 종료",
    ];

    mockRandoms(randoms);
    mockQuestions(answers);

    const app = new App();
    app.play();

    messages.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });

  test("예외 테스트", () => {
    const randoms = [1, 3, 5];
    const answers = ["1234"];

    mockRandoms(randoms);
    mockQuestions(answers);

    expect(() => {
      const app = new App();
      app.play();
    }).toThrow();
  });
});
