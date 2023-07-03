import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { isoCertificateValidationSchema } from 'validationSchema/iso-certificates';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.iso_certificate
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getIsoCertificateById();
    case 'PUT':
      return updateIsoCertificateById();
    case 'DELETE':
      return deleteIsoCertificateById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getIsoCertificateById() {
    const data = await prisma.iso_certificate.findFirst(convertQueryToPrismaUtil(req.query, 'iso_certificate'));
    return res.status(200).json(data);
  }

  async function updateIsoCertificateById() {
    await isoCertificateValidationSchema.validate(req.body);
    const data = await prisma.iso_certificate.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteIsoCertificateById() {
    const data = await prisma.iso_certificate.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
