import { Prisma } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime"

export interface Options {
	select?: Prisma.UserSelect<DefaultArgs>
	[x: string]: any
}

export interface QueryOptions {
	select?: Prisma.UserSelect<DefaultArgs>
	cursor?: Prisma.UserWhereUniqueInput
	distinct?: Prisma.Enumerable<Prisma.UserScalarFieldEnum>
	include?: Prisma.UserInclude
	orderBy?: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput>
	skip?: number
	take?: number
}

export interface UniqueWhereCondition {
	where: Prisma.UserWhereUniqueInput
}
export interface ManyWhereCondition {
	where: Prisma.UserWhereInput
}

export interface CreateProps {
	data: Prisma.UserCreateInput
	options?: Options
}

export interface FindManyProps extends ManyWhereCondition {
	options?: QueryOptions
}

export interface FindUniqueProps extends UniqueWhereCondition {
	options?: Options
}
export interface FindFirstProps extends ManyWhereCondition {
	options?: Options
}
export interface UpdateUniqueProps extends UniqueWhereCondition {
	data: Prisma.UserUpdateInput
	options?: Options
}

export interface UpdateManyProps extends ManyWhereCondition {
	data: Prisma.UserUpdateInput
}

export interface DeleteProps extends UniqueWhereCondition {
	options?: Options
}
export interface CountProps extends ManyWhereCondition {
	options?: QueryOptions
}
export interface DeleteManyProps extends ManyWhereCondition {}
