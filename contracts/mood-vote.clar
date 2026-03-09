;; mood-vote.clar
;; Mood Polls — 10 daily questions, one vote per poll per ~24h
;; Clarity Version: 3

;; ========================
;; CONSTANTS & ERRORS
;; ========================

(define-constant ERR-ALREADY-VOTED (err u100))
(define-constant ERR-INVALID-POLL  (err u101))
(define-constant ERR-INVALID-OPTION (err u102))

;; ~144 Stacks blocks = 1 day
(define-constant COOLDOWN u144)
(define-constant MAX-POLL u10)

;; ========================
;; DATA MAPS
;; ========================

;; Last block when user voted on a specific poll
(define-map last-vote { user: principal, poll-id: uint } uint)

;; Total vote counts per poll per option
(define-map vote-counts { poll-id: uint, option: uint } uint)

;; Total votes per user (for leaderboard/activity tracking)
(define-map user-total-votes principal uint)

;; ========================
;; PUBLIC FUNCTIONS
;; ========================

(define-public (vote (poll-id uint) (option uint))
  (let
    (
      (caller tx-sender)
      (current-block stacks-block-height)
      (last-block (default-to u0 (map-get? last-vote { user: caller, poll-id: poll-id })))
    )
    ;; Validate poll-id range 1..10
    (asserts! (and (>= poll-id u1) (<= poll-id MAX-POLL)) ERR-INVALID-POLL)
    ;; Validate option: 1 or 2
    (asserts! (or (is-eq option u1) (is-eq option u2)) ERR-INVALID-OPTION)
    ;; Enforce cooldown (first vote always allowed)
    (asserts!
      (or (is-eq last-block u0) (>= (- current-block last-block) COOLDOWN))
      ERR-ALREADY-VOTED
    )
    ;; Record vote block
    (map-set last-vote { user: caller, poll-id: poll-id } current-block)
    ;; Increment vote count
    (map-set vote-counts
      { poll-id: poll-id, option: option }
      (+ u1 (default-to u0 (map-get? vote-counts { poll-id: poll-id, option: option })))
    )
    ;; Increment user total votes
    (map-set user-total-votes caller
      (+ u1 (default-to u0 (map-get? user-total-votes caller)))
    )
    (ok true)
  )
)

;; ========================
;; READ-ONLY FUNCTIONS
;; ========================

;; Get vote counts for a poll
(define-read-only (get-poll-results (poll-id uint))
  (ok {
    option1: (default-to u0 (map-get? vote-counts { poll-id: poll-id, option: u1 })),
    option2: (default-to u0 (map-get? vote-counts { poll-id: poll-id, option: u2 }))
  })
)

;; Check if user can vote on a specific poll right now
(define-read-only (can-vote (user principal) (poll-id uint))
  (let
    (
      (last-block (default-to u0 (map-get? last-vote { user: user, poll-id: poll-id })))
      (current-block stacks-block-height)
    )
    (ok (or (is-eq last-block u0) (>= (- current-block last-block) COOLDOWN)))
  )
)

;; Get last vote block for user on a poll
(define-read-only (get-last-vote-block (user principal) (poll-id uint))
  (ok (default-to u0 (map-get? last-vote { user: user, poll-id: poll-id })))
)

;; Get total votes cast by user across all polls
(define-read-only (get-user-total-votes (user principal))
  (ok (default-to u0 (map-get? user-total-votes user)))
)
