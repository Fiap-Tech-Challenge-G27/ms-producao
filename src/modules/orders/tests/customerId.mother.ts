import { randomId } from "@shared/tests/random";

export const customerMother = {
    customer: {
        _id: randomId(),
        name: "mocked user",
        email: "user@mock.com",
        cpf: "28706384340",
    }
}