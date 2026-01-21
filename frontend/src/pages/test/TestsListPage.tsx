import { TESTS } from "../../tests"
import { TestListElementCard } from "../../components/molecules/cards"

export const TestsListPage = () => {
    return (
        <div>
            <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
                { TESTS.map((test, index) => (
                    <TestListElementCard key={index} test={test} />
                )) }
            </div>
        </div>
    )
}