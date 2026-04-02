import { Video } from '../model/Video.js'

export interface FilterCriteria {
  minLikes?:    number
  minViews?:    number
  minComments?: number
  minShares?:   number
  requireCaption?: boolean 
  captionMustContain?: string[] // palavras que devem aparecer na legenda, se fornecida
}

interface FilterResult {
  approved: boolean
  reasons:  string[]
}

export class VideoFilter {
  constructor(private criteria: FilterCriteria) {}

  evaluate(video: Video): FilterResult {
    const m = video.metrics
    const reasons: string[] = []



    if (this.criteria.requireCaption) {
    const caption = video.caption?.trim()
    if (!caption || caption === '...') {
    reasons.push(`caption ausente ou vazia: "${video.caption}"`)
     }
    }



    if (this.criteria.captionMustContain?.length) {
    const caption = video.caption?.toLowerCase() ?? ''
    const matched = this.criteria.captionMustContain.some(
    word => caption.includes(word.toLowerCase())
    )

    if (!matched) {
    reasons.push(`caption fora do dicionário: "${video.caption}"`)
    }
  }


    if (this.criteria.minLikes !== undefined) {
      const likes = m.likes ?? 0  // defende contra undefined
      if (likes < this.criteria.minLikes) {
        reasons.push(`likes insuficiente: ${likes} < ${this.criteria.minLikes}`)
      }
    }

    if (this.criteria.minViews !== undefined) {
      const views = m.views ?? 0
      if (views < this.criteria.minViews) {
        reasons.push(`views insuficiente: ${views} < ${this.criteria.minViews}`)
      }
    }

    if (this.criteria.minComments !== undefined) {
      const comments = m.comments ?? 0
      if (comments < this.criteria.minComments) {
        reasons.push(`comments insuficiente: ${comments} < ${this.criteria.minComments}`)
      }
    }

    if (this.criteria.minShares !== undefined) {
      const shares = m.shares ?? 0  // ?? 0 porque o campo pode não vir
      if (shares < this.criteria.minShares) {
        reasons.push(`shares insuficiente: ${shares} < ${this.criteria.minShares}`)
      }
    }

    return {
      approved: reasons.length === 0,
      reasons
    }
  }
}