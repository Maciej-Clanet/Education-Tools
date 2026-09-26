export const backupStrategyScenarios = {
  "type": {
    "acceptedPairs": [
      [
        "full",
        "simple"
      ],
      [
        "incremental",
        "small"
      ],
      [
        "differential",
        "short"
      ]
    ],
    "incompleteMessage": "Choose an option and a reason.",
    "successMessage": "That reason explains the choice. Now weigh its limitations.",
    "retryMessage": "Reconsider how the reason matches this choice.",
    "explanationsByChoice": {
      "full": "Full backups can simplify restoring selected data, but frequently copying 1 TB of archive resources may waste time and capacity. Separate archive and active-record schedules.",
      "incremental": "A full baseline plus regular incrementals can reduce repeated copying. Keep every required set and test chain recovery against the college’s short downtime need.",
      "differential": "A full baseline plus a suitable differential needs fewer restore sets than a long incremental chain. Differentials may grow, so measure backup and restore times."
    }
  },
  "frequency": {
    "acceptedPairs": [
      [
        "hourly",
        "recent"
      ]
    ],
    "incompleteMessage": "Choose an option and a reason.",
    "successMessage": "This schedule fits the stated one-hour loss limit, provided jobs succeed on time.",
    "retryMessage": "Check both the reason and the one-hour maximum loss in the scenario.",
    "explanationsByChoice": {
      "hourly": "Hourly backups better match records changing throughout the day, but changes since the last successful job remain at risk. Check load and monitor job completion.",
      "daily": "Daily copying reduces activity, but could lose much more than one hour of attendance changes. It does not meet this requirement; an unchanged archive can have its own schedule.",
      "weekly": "Weekly copying could lose several days of changing records. Saving resources does not meet the stated one-hour loss limit."
    }
  },
  "location": {
    "acceptedPairs": [
      [
        "both",
        "balance"
      ]
    ],
    "incompleteMessage": "Choose an option and a reason.",
    "successMessage": "This arrangement addresses quick local recovery and a separate copy for site loss.",
    "retryMessage": "The scenario requires both quick local access and protection against losing the college site.",
    "explanationsByChoice": {
      "onsite": "An onsite copy can help local recovery, but a fire could destroy the live server and this copy together.",
      "offsite": "An offsite copy addresses site loss, but on its own does not provide the requested local recovery copy. Transfer and restore times still need testing.",
      "both": "Local and offsite copies can balance recovery speed and site-loss protection, with extra storage, management and protection requirements."
    }
  },
  "management": {
    "acceptedPairs": [
      [
        "inhouse",
        "control"
      ],
      [
        "thirdparty",
        "support"
      ]
    ],
    "incompleteMessage": "Choose an option and a reason.",
    "successMessage": "That reason explains the choice. Now weigh its limitations.",
    "retryMessage": "Reconsider how the reason matches this choice.",
    "explanationsByChoice": {
      "inhouse": "Direct control is useful, but limited IT staff need enough time, expertise and cover to run and test recovery reliably.",
      "thirdparty": "Specialist help may suit limited IT staffing. Check recurring cost, privacy/security, service availability and proven recovery speed; the college must still oversee the plan."
    }
  }
}
