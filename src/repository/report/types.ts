import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime";

export interface Options {
  select?: Prisma.IncidentReportSelect<DefaultArgs>;
  include?: Prisma.IncidentReportInclude<DefaultArgs>;
  [x: string]: any;
}

export interface QueryOptions {
  select?: Prisma.IncidentReportSelect<DefaultArgs>;
  cursor?: Prisma.IncidentReportWhereUniqueInput;
  distinct?: Prisma.Enumerable<Prisma.IncidentReportScalarFieldEnum>;
  include?: Prisma.IncidentReportInclude<DefaultArgs>;
  orderBy?: Prisma.Enumerable<Prisma.IncidentReportOrderByWithRelationInput>;
  skip?: number;
  take?: number;
}

export interface UniqueWhereCondition {
  where: Prisma.IncidentReportWhereUniqueInput;
}
export interface ManyWhereCondition {
  where: Prisma.IncidentReportWhereInput;
}

export interface CreateProps {
  data: Prisma.IncidentReportUncheckedCreateInput | Prisma.IncidentReportCreateInput;
  options?: Options;
}

export interface FindManyProps extends ManyWhereCondition {
  options?: QueryOptions;
}

export interface FindUniqueProps extends UniqueWhereCondition {
  options?: Options;
}
export interface FindFirstProps extends ManyWhereCondition {
  options?: Options;
}
export interface UpdateUniqueProps extends UniqueWhereCondition {
  data: Prisma.IncidentReportUpdateInput;
  options?: Options;
}

export interface DeleteProps extends UniqueWhereCondition {
  options?: Options;
}
export interface CountProps extends ManyWhereCondition {
  options?: QueryOptions;
}
export interface DeleteManyProps extends ManyWhereCondition {}
