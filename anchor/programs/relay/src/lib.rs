use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
// declare_id!("DBPA83yqVRDspVi2sXGWPQbFR4AwuBpFZY79GyKHb53N");
// declare_id!("KBScsXsbBp8cTgzkML8bFRvoYb5E3fRGpxxsaU4hzRz");
// declare_id!("DjbBmWi8WzYCDnFG8AMMnNErqHa3W6e39gkdQxN8Hkwf");
declare_id!("5ZeMSd6ot2FPBBAt1s4hF3ffKAjNvp1LvFNT62FPqQCi");


#[program]
mod relay {
    use super::*;

    pub fn create_relay_entry(
        ctx: Context<CreateEntry>,
        title: String,
        message: String,
        // recipient: Pubkey,
        recipient: String,
        enc: bool,
    ) -> Result<()> {
        msg!("Relay Entry Created");
        msg!("Title: {}", title);
        msg!("Message: {}", message);
        msg!("recipient: {}", recipient);
        msg!("Encryption?: {}", enc);

        let relay_entry = &mut ctx.accounts.relay_entry;
        relay_entry.owner = ctx.accounts.owner.key();
        relay_entry.title = title;
        relay_entry.message = message;
        relay_entry.recipient = recipient;
        relay_entry.enc = enc;
        Ok(())
    }

    pub fn update_relay_entry(
        ctx: Context<UpdateEntry>,
        title: String,
        message: String,
        // recipient: Pubkey,
        recipient: String,
        enc: bool,
    ) -> Result<()> {
        msg!("Relay Entry Updated");
        msg!("Title: {}", title);
        msg!("Message: {}", message);
        msg!("recipient: {}", recipient);
        msg!("Encryption?: {}", enc);
        let relay_entry = &mut ctx.accounts.relay_entry;
        relay_entry.message = message;
        relay_entry.recipient = recipient;
        relay_entry.enc = enc;

        Ok(())
    }

    pub fn delete_relay_entry(_ctx: Context<DeleteEntry>, title: String) -> Result<()> {
        msg!("Relay entry titled {} deleted", title);
        Ok(())
    }
}

#[account]
pub struct RelayEntryState {
    pub owner: Pubkey,
    pub title: String,
    pub message: String,
    // pub recipient: Pubkey,
    pub recipient: String,
    pub enc: bool,
}

#[derive(Accounts)]
#[instruction(title: String, message: String)]
pub struct CreateEntry<'info> {
    #[account(
        init,
        seeds = [title.as_bytes(), owner.key().as_ref()], 
        bump, 
        payer = owner, 
        // space = 8 + 32 + 4 + title.len() + 4 + message.len() + 4 + 44 + 1
        space = 1024

    )]
    pub relay_entry: Account<'info, RelayEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String, message: String)]
pub struct UpdateEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()], 
        bump, 
        // realloc = 8 + 32 + 4 + title.len() + 4 + message.len() + 44 + 1,
        realloc = 1024,
        realloc::payer = owner, 
        realloc::zero = true, 
    )]
    pub relay_entry: Account<'info, RelayEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteEntry<'info> {
    #[account( 
        mut, 
        seeds = [title.as_bytes(), owner.key().as_ref()], 
        bump, 
        close= owner,
    )]
    pub relay_entry: Account<'info, RelayEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}
