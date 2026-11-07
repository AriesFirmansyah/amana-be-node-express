import { IncidentReport, Prisma, PrismaPromise } from "@prisma/client";
import {
  CountProps,
  CreateProps,
  DeleteManyProps,
  DeleteProps,
  FindFirstProps,
  FindManyProps,
  FindUniqueProps,
  UpdateUniqueProps,
} from "./types";
import prisma from "@server/client";

const create = async (props: CreateProps): Promise<IncidentReport> => {
  const { data, options } = props;
  const created = await prisma.incidentReport.create({
    data: data as Prisma.IncidentReportCreateInput,
    ...options,
  });
  return created;
};

const findMany = (props: FindManyProps): Promise<IncidentReport[]> => {
  const { where, options } = props;
  return prisma.incidentReport.findMany({ where, ...options });
};

const findUnique = async (
  props: FindUniqueProps,
): Promise<IncidentReport | null> => {
  const { where, options } = props;
  return prisma.incidentReport.findUnique({ where, ...options });
};

const findFirst = (props: FindFirstProps): Promise<IncidentReport | null> => {
  const { where, options } = props;
  return prisma.incidentReport.findFirst({ where, ...options });
};

const count = (props: CountProps): Promise<number> => {
  const { where } = props;
  return prisma.incidentReport.count({ where });
};

const updateUnique = async (
  props: UpdateUniqueProps,
): Promise<IncidentReport> => {
  const { where, data, options } = props;
  return prisma.incidentReport.update({ where, data, ...options });
};

const remove = async (props: DeleteProps): Promise<IncidentReport> => {
  const { where, options } = props;
  return prisma.incidentReport.delete({ where, ...options });
};

const removeMany = async (
  props: DeleteManyProps,
): Promise<Prisma.BatchPayload> => {
  const { where } = props;
  return prisma.incidentReport.deleteMany({ where });
};

const reportRepository = {
  count,
  create,
  remove,
  findMany,
  findFirst,
  findUnique,
  removeMany,
  updateUnique,
};

export default reportRepository;
