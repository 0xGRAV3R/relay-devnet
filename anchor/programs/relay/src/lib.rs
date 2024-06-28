use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("DBPA83yqVRDspVi2sXGWPQbFR4AwuBpFZY79GyKHb53N");

#[program]
mod relay {
    use super::*;

    pub fn create_relay_entry(
        ctx: Context<CreateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        msg!("Relay Entry Created");
        msg!("Title: {}", title);
        msg!("Message: {}", message);

        let relay_entry = &mut ctx.accounts.relay_entry;
        relay_entry.owner = ctx.accounts.owner.key();
        relay_entry.title = title;
        relay_entry.message = message;
        Ok(())
    }

    pub fn update_relay_entry(
        ctx: Context<UpdateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        msg!("Relay Entry Updated");
        msg!("Title: {}", title);
        msg!("Message: {}", message);

        let relay_entry = &mut ctx.accounts.relay_entry;
        relay_entry.message = message;

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
}

#[derive(Accounts)]
#[instruction(title: String, message: String)]
pub struct CreateEntry<'info> {
    #[account(
        init,
        seeds = [title.as_bytes(), owner.key().as_ref()], 
        bump, 
        payer = owner, 
        space = 8 + 32 + 4 + title.len() + 4 + message.len()
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
        realloc = 8 + 32 + 4 + title.len() + 4 + message.len(),
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
