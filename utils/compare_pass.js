import bcrypt from 'bcrypt';

export async function comparePassword(password, hashedPassword) {
    const match = await bcrypt.compare(password, hashedPassword);
    if (match) {
        return 0
    } else {
        return 1
    }
}