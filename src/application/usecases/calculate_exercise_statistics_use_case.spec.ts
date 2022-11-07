import { mock } from 'jest-mock-extended';
import { Statistics } from "../../domain/statistics"
import { GetStatisticsUseCase} from "./calculate_exercise_statistics_use_case"
describe("do", () => {
    it("can calculate pass percentage", async () => {
        // Arrange
        
        const expected = new Statistics(3498072393, [500,600], {"A<> first query": {passes: 20, fails: 6, syntax_errors: 1, total: 27, pass_percentage: 20/27}} )
        

        // Mock
        

        //Act
        

        // Assert
       

    }),
    it("can calculate average handin time", () => {

    }),
    it("can calculate total of submissions", () => {

    })
} )
