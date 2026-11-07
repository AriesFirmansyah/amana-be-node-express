import { Prisma, User } from "@prisma/client";

export type CreateUserProps = {
  data: Partial<Prisma.UserCreateInput>;
  keys?: (keyof User)[];
};

export type QueryUsersProps = {
  where: Prisma.UserWhereInput;
  options?: {
    limit?: number;
    page?: number;
    sortBy?: string;
    cursor?: Prisma.UserWhereUniqueInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    sortType?: "asc" | "desc";
  };
  keys?: (keyof User)[];
};

export type QueryUsersResponse<Key extends keyof User> = {
  count: number;
  dataModel: Pick<User, Key>[];
  queryResults: Pick<User, Key>[];
};
