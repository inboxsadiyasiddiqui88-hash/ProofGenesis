from blockchain.blockchain import Blockchain

bc = Blockchain()

block = bc.add_block(
    "CASE-2026-001",
    "PG-EV-0001",
    "123456789abcdef"
)

print(block)



