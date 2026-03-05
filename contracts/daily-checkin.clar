;; daily-checkin.clar
;; Daily Check-in dApp on Stacks Blockchain
;; Clarity Version: 4

;; ========================
;; CONSTANTS & ERRORS
;; ========================

(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-ALREADY-CHECKED-IN (err u100))
(define-constant ERR-NOT-ENOUGH-STREAK (err u101))
(define-constant ERR-NFT-ALREADY-CLAIMED (err u102))
(define-constant ERR-NOT-OWNER (err u103))
(define-constant ERR-INSUFFICIENT-FUNDS (err u104))

;; ~144 Stacks blocks ≈ 1 day (avg 10 min/block)
(define-constant BLOCKS-PER-DAY u144)
;; Grace period: up to 2 days without breaking streak
(define-constant STREAK-GRACE-PERIOD u288)

;; Reward amounts in micro-STX (1 STX = 1,000,000 uSTX)
(define-constant REWARD-1ST u5000000)
(define-constant REWARD-2ND u4000000)
(define-constant REWARD-3RD u3000000)
(define-constant REWARD-4TH u2000000)
(define-constant REWARD-5TH u1000000)

;; ========================
;; NFT DEFINITIONS
;; ========================

(define-non-fungible-token streak-7-badge uint)
(define-non-fungible-token streak-30-badge uint)

;; ========================
;; DATA VARIABLES
;; ========================

(define-data-var streak-7-counter uint u0)
(define-data-var streak-30-counter uint u0)
(define-data-var user-count uint u0)

;; ========================
;; DATA MAPS
;; ========================

;; Per-user stats
(define-map user-stats principal
  {
    last-checkin-block: uint,
    streak: uint,
    total-checkins: uint,
    nft-7-claimed: bool,
    nft-30-claimed: bool
  }
)

;; Ordered index for leaderboard traversal
(define-map user-index uint principal)
(define-map user-registered principal bool)

;; ========================
;; PRIVATE HELPERS
;; ========================

(define-private (register-user-if-new (user principal))
  (if (is-none (map-get? user-registered user))
    (let ((idx (var-get user-count)))
      (map-set user-index idx user)
      (map-set user-registered user true)
      (var-set user-count (+ idx u1))
      true
    )
    true
  )
)

;; ========================
;; PUBLIC FUNCTIONS
;; ========================

;; Daily check-in — updates streak and total count
(define-public (check-in)
  (let
    (
      (caller tx-sender)
      (current-block block-height)
      (stats
        (default-to
          {
            last-checkin-block: u0,
            streak: u0,
            total-checkins: u0,
            nft-7-claimed: false,
            nft-30-claimed: false
          }
          (map-get? user-stats caller)
        )
      )
      (last-block (get last-checkin-block stats))
      (blocks-since
        (if (> current-block last-block)
          (- current-block last-block)
          u0
        )
      )
    )
    ;; Enforce minimum 1-day wait between check-ins
    (asserts!
      (or (is-eq last-block u0) (>= blocks-since BLOCKS-PER-DAY))
      ERR-ALREADY-CHECKED-IN
    )
    (let
      (
        ;; Streak continues within grace period, resets otherwise
        (new-streak
          (if (or (is-eq last-block u0) (> blocks-since STREAK-GRACE-PERIOD))
            u1
            (+ (get streak stats) u1)
          )
        )
        (new-total (+ (get total-checkins stats) u1))
      )
      (register-user-if-new caller)
      (map-set user-stats caller
        {
          last-checkin-block: current-block,
          streak: new-streak,
          total-checkins: new-total,
          nft-7-claimed: (get nft-7-claimed stats),
          nft-30-claimed: (get nft-30-claimed stats)
        }
      )
      (ok { streak: new-streak, total-checkins: new-total })
    )
  )
)

;; Claim 7-day streak NFT badge
(define-public (claim-streak-7-nft)
  (let
    (
      (caller tx-sender)
      (stats (unwrap! (map-get? user-stats caller) ERR-NOT-ENOUGH-STREAK))
    )
    (asserts! (>= (get streak stats) u7) ERR-NOT-ENOUGH-STREAK)
    (asserts! (not (get nft-7-claimed stats)) ERR-NFT-ALREADY-CLAIMED)
    (let ((nft-id (+ (var-get streak-7-counter) u1)))
      (try! (nft-mint? streak-7-badge nft-id caller))
      (var-set streak-7-counter nft-id)
      (map-set user-stats caller (merge stats { nft-7-claimed: true }))
      (ok nft-id)
    )
  )
)

;; Claim 30-day streak NFT badge
(define-public (claim-streak-30-nft)
  (let
    (
      (caller tx-sender)
      (stats (unwrap! (map-get? user-stats caller) ERR-NOT-ENOUGH-STREAK))
    )
    (asserts! (>= (get streak stats) u30) ERR-NOT-ENOUGH-STREAK)
    (asserts! (not (get nft-30-claimed stats)) ERR-NFT-ALREADY-CLAIMED)
    (let ((nft-id (+ (var-get streak-30-counter) u1)))
      (try! (nft-mint? streak-30-badge nft-id caller))
      (var-set streak-30-counter nft-id)
      (map-set user-stats caller (merge stats { nft-30-claimed: true }))
      (ok nft-id)
    )
  )
)

;; Owner distributes STX rewards to top-5 most active users
;; Total: 5 + 4 + 3 + 2 + 1 = 15 STX paid from owner's wallet
(define-public (distribute-rewards
    (first-place principal)
    (second-place principal)
    (third-place principal)
    (fourth-place principal)
    (fifth-place principal)
  )
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
    (try! (stx-transfer? REWARD-1ST tx-sender first-place))
    (try! (stx-transfer? REWARD-2ND tx-sender second-place))
    (try! (stx-transfer? REWARD-3RD tx-sender third-place))
    (try! (stx-transfer? REWARD-4TH tx-sender fourth-place))
    (try! (stx-transfer? REWARD-5TH tx-sender fifth-place))
    (ok true)
  )
)

;; ========================
;; READ-ONLY FUNCTIONS
;; ========================

;; Get stats for any user
(define-read-only (get-user-stats (user principal))
  (ok
    (default-to
      {
        last-checkin-block: u0,
        streak: u0,
        total-checkins: u0,
        nft-7-claimed: false,
        nft-30-claimed: false
      }
      (map-get? user-stats user)
    )
  )
)

;; Get leaderboard entry at given index
(define-read-only (get-leaderboard-entry (index uint))
  (match (map-get? user-index index)
    user
      (match (map-get? user-stats user)
        stats
          (ok (some {
            user: user,
            streak: (get streak stats),
            total-checkins: (get total-checkins stats)
          }))
        (ok none)
      )
    (ok none)
  )
)

;; Total number of unique users
(define-read-only (get-total-users)
  (ok (var-get user-count))
)

;; NFT minting statistics
(define-read-only (get-nft-counts)
  (ok {
    streak-7-total: (var-get streak-7-counter),
    streak-30-total: (var-get streak-30-counter)
  })
)
