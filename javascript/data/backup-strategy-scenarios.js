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
      "incremental": "A full baseline plus regular incrementals can reduce repeated copying. Keep every required set and test chain recovery against the college\u2019s short downtime need.",
      "differential": "A full baseline plus a suitable differential needs fewer restore sets than a long incremental chain. Differentials may grow, so measure backup and restore times."
    }
  },
  "frequency": {
    "acceptedPairs": [
      [
        "hourly",
        "recent"
      ],
      [
        "daily",
        "resources"
      ],
      [
        "weekly",
        "resources"
      ]
    ],
    "incompleteMessage": "Choose an option and a reason.",
    "successMessage": "That reason explains the choice. Now weigh its limitations.",
    "retryMessage": "Reconsider how the reason matches this choice.",
    "explanationsByChoice": {
      "hourly": "Hourly backups better match records changing throughout the day, but changes since the last successful job remain at risk. Check load and monitor job completion.",
      "daily": "Daily copying reduces activity, but a full day\u2019s attendance changes may be lost. Justify that tolerance or increase frequency; use a separate archive schedule.",
      "weekly": "Weekly backups may lose several days of changing student records. Saving resources alone is unlikely to justify that risk here; reconsider the frequency. An unchanged archive is a different case."
    }
  },
  "location": {
    "acceptedPairs": [
      [
        "onsite",
        "local"
      ],
      [
        "offsite",
        "site"
      ],
      [
        "both",
        "balance"
      ]
    ],
    "incompleteMessage": "Choose an option and a reason.",
    "successMessage": "That reason explains the choice. Now weigh its limitations.",
    "retryMessage": "Reconsider how the reason matches this choice.",
    "explanationsByChoice": {
      "onsite": "Local access can help restore speed, but the only backup should not share all the live server\u2019s site risks. Explain how a site disaster would be covered.",
      "offsite": "A separate location helps cover site loss. Test transfer and full recovery speed; reliable fast internet does not guarantee a short restore.",
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
