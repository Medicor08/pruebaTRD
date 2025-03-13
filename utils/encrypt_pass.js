import bcrypt from 'bcrypt';
const saltRounds = 2;

export async function hashPassword(password) {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}