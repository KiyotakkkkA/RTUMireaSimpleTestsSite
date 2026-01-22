import { TESTS } from "../../tests"
import { TestListElementCard } from "../../components/molecules/cards"

export const TestsListPage = () => {
    return (
        <div className="w-full my-auto">
            <div className="mx-auto flex w-full max-w-3xl flex-col space-y-4">
                { TESTS.map((test, index) => (
                    <TestListElementCard key={index} test={test} />
                )) }
            </div>
        </div>
    )
}