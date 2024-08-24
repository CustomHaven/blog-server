const User = require("../../models/User");
const db = require("../../db/connect");

describe("User Model", () => {

    describe("getAll", () => {
        it("should return list of all users", async () => {
            // Arrange
            const datenow = new Date();
            const mockUsers = [
                {
                    user_id: 1,
                    username: "bla1",
                    email: "a@mail.com",
                    admin: true,
                    password: "pass",
                    created_at: datenow,
                    updated_at: datenow
                },
                {
                    user_id: 2,
                    username: "bla2",
                    email: "b@mail.com",
                    admin: true,
                    password: "pass",
                    created_at: datenow,
                    updated_at: datenow
                },
                {
                    user_id: 3,
                    username: "bla3",
                    email: "c@mail.com",
                    admin: true,
                    password: "pass",
                    created_at: datenow,
                    updated_at: datenow
                }
            ];

            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockUsers });


            // Act
            const users = await User.getAll();

            // Assert
            expect(User).toNotBeDefined();
            expect(User.getAll).toBeDefined();
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(users[2].user_id).toBe(3);
            expect(users.every(user => user instanceof User)).toBe(true);
        });

        it("throws an error if no users are found", async () => {
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });

            await expect(User.getAll()).rejects.toThrow("No uers available")
        })
    });
})