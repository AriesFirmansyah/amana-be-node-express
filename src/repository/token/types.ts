import { DefaultArgs } from "@prisma/client/runtime"
import { Prisma, Token } from "@prisma/client"

export interface Options {
	select?: {
		[P in keyof Token extends Token | undefined ? P : never]: Token[P]
	}
	[x: string]: any
}

export interface QueryOptions {
	select?: Prisma.TokenSelect<DefaultArgs>
	cursor?: Prisma.TokenWhereUniqueInput
	distinct?: Prisma.Enumerable<Prisma.TokenScalarFieldEnum>
	include?: Prisma.TokenInclude
	orderBy?: Prisma.Enumerable<Prisma.TokenOrderByWithRelationInput>
	skip?: number
	take?: number
}

export interface UniqueWhereCondition {
	where: Prisma.TokenWhereUniqueInput
}
export interface ManyWhereCondition {
	where: Prisma.TokenWhereInput
}

export interface CreateProps {
	data: Prisma.TokenCreateInput
	options?: Options
}

export interface FindUniqueProps extends UniqueWhereCondition {
	options?: Options
}
export interface FindManyProps extends ManyWhereCondition {
	options: QueryOptions
}

export interface FindFirstProps extends ManyWhereCondition {
	options?: Options
}

export interface UpdateUniqueProps extends UniqueWhereCondition {
	data: Prisma.TokenUpdateInput
	options?: Options
}
export interface UpdateManyProps extends ManyWhereCondition {
	data: Prisma.TokenUpdateInput
}
export interface DeleteProps extends UniqueWhereCondition {
	options?: Options
}
export interface DeleteManyProps extends ManyWhereCondition {}
