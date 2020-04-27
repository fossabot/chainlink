import { getCustomRepository } from 'typeorm'
import { Router, Request, Response } from 'express'
import { search, count, SearchParams } from '../queries/search'
import jobRunsSerializer from '../serializers/jobRunsSerializer'
import jobRunSerializer from '../serializers/jobRunSerializer'
import { JobRunRepository } from '../repositories/JobRunRepository'
import * as pagination from '../utils/pagination'

const router = Router()

const searchParams = (req: Request): SearchParams => {
  const params = pagination.parseParams(req.query)

  return {
    ...params,
    searchQuery: req.query.query,
  }
}

router.get('/job_runs', async (req: Request, res: Response) => {
  const params = searchParams(req)
  const s = await search(params)
  const runs = s.results
  const runCount = s.totalRecords
  const json = jobRunsSerializer(runs, runCount)
  return res.send(json)
})

router.get('/job_runs/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  const jobRunRepository = getCustomRepository(JobRunRepository)
  const jobRun = await jobRunRepository.findById(id)

  if (jobRun) {
    const json = jobRunSerializer(jobRun)
    return res.send(json)
  }

  return res.sendStatus(404)
})

export default router
