import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const UserService = {
  // Existing create user function
  async createUser({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // New function to get pending staff approvals
  async getPendingUsers() {
    return await prisma.user.findMany({
      where: {
        role: 'STAFF',
        isApproved: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isApproved: true,
        createdAt: true,
      },
    });
  },

  // Function to approve staff
  async approveStaff(id: string) {
    return await prisma.user.update({
      where: { id },
      data: { isApproved: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isApproved: true,
      },
    });
  },

  // Function to delete/reject user
  async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    });
  },
};